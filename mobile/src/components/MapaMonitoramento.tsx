import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { mapaService } from '../services/mapaService';
import { AreaMonitorada } from '../types/Mapa';
import { NivelRisco, RISCO_CORES, RISCO_LABEL, RISCO_EMOJI } from '../utils/riskCalculator';
import { Colors } from '../styles/colors';

interface Props {
  height?: number;
}

const RISCO_NIVEIS: NivelRisco[] = ['baixo', 'medio', 'alto'];

// Builds a self-contained HTML page with Leaflet + OpenStreetMap.
// OpenStreetMap tiles are free and require no API key.
// Future: swap tileLayer URL for a PostGIS-based tile server if needed.
function buildHTML(areas: AreaMonitorada[]): string {
  const areasJSON = JSON.stringify(areas);
  const coresJSON = JSON.stringify(RISCO_CORES);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; background:#e8f0e8; overflow:hidden; }
    #map { width:100%; height:100%; }
    .leaflet-control-attribution { font-size:9px !important; }
    .leaflet-control-zoom a {
      font-size:16px !important;
      line-height:28px !important;
      width:30px !important;
      height:30px !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      center: [-23.9608, -46.3336],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
      tap: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    var areas = ${areasJSON};
    var cores = ${coresJSON};

    function makeIcon(color, selected) {
      var size = selected ? 38 : 30;
      var border = selected ? 4 : 3;
      return L.divIcon({
        className: '',
        html: '<div style="' +
          'width:' + size + 'px;height:' + size + 'px;' +
          'border-radius:50%;' +
          'background:' + color + ';' +
          'border:' + border + 'px solid white;' +
          'box-shadow:0 2px 8px rgba(0,0,0,0.45);' +
          'cursor:pointer;' +
        '"></div>',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });
    }

    var markers = {};
    var currentSelected = null;

    areas.forEach(function(area) {
      var color = cores[area.nivelRisco];
      var marker = L.marker([area.latitude, area.longitude], {
        icon: makeIcon(color, false)
      }).addTo(map);

      marker.on('click', function() {
        // Reset previous selection
        if (currentSelected && markers[currentSelected]) {
          var prev = areas.find(function(a){ return a.id === currentSelected; });
          if (prev) markers[currentSelected].setIcon(makeIcon(cores[prev.nivelRisco], false));
        }

        if (currentSelected === area.id) {
          // Deselect
          currentSelected = null;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'deselect' }));
        } else {
          // Select
          currentSelected = area.id;
          marker.setIcon(makeIcon(color, true));
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', area: area }));
        }
      });

      markers[area.id] = marker;
    });

    // Close selection when tapping empty map
    map.on('click', function() {
      if (currentSelected && markers[currentSelected]) {
        var prev = areas.find(function(a){ return a.id === currentSelected; });
        if (prev) markers[currentSelected].setIcon(makeIcon(cores[prev.nivelRisco], false));
      }
      currentSelected = null;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'deselect' }));
    });
  </script>
</body>
</html>`;
}

const MapaMonitoramento: React.FC<Props> = ({ height = 260 }) => {
  const [areas, setAreas] = useState<AreaMonitorada[]>([]);
  const [selected, setSelected] = useState<AreaMonitorada | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    mapaService.getAreasMonitoradas().then(setAreas);
  }, []);

  const htmlContent = areas.length > 0 ? buildHTML(areas) : null;
  const totalAltoRisco = areas.filter((a) => a.nivelRisco === 'alto').length;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'select') setSelected(msg.area);
      else setSelected(null);
    } catch {}
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Map ── */}
      <View style={[styles.mapContainer, { height }]}>
        {!htmlContent ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primaryDark} />
          </View>
        ) : loadError ? (
          <View style={styles.center}>
            <Ionicons name="wifi-outline" size={36} color={Colors.textLight} />
            <Text style={styles.errorText}>
              Sem internet para carregar o mapa.{'\n'}Verifique a conexão do emulador.
            </Text>
          </View>
        ) : (
          <>
            <WebView
              source={{ html: htmlContent }}
              style={styles.webview}
              scrollEnabled={false}
              nestedScrollEnabled
              javaScriptEnabled
              originWhitelist={['*']}
              onMessage={handleMessage}
              onLoad={() => setMapLoaded(true)}
              onError={() => setLoadError(true)}
              onHttpError={() => setLoadError(true)}
              androidLayerType="hardware"
            />

            {/* Loading shimmer until Leaflet finishes */}
            {!mapLoaded && (
              <View style={[StyleSheet.absoluteFillObject, styles.center, { backgroundColor: '#e8f0e8' }]}>
                <ActivityIndicator size="large" color={Colors.primaryDark} />
                <Text style={styles.loadingText}>Carregando mapa…</Text>
              </View>
            )}

            {/* Area info card — appears on marker tap */}
            {selected && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <View style={[styles.riscoBadge, { backgroundColor: RISCO_CORES[selected.nivelRisco] }]}>
                    <Text style={styles.riscoBadgeText}>
                      {RISCO_EMOJI[selected.nivelRisco]}  {RISCO_LABEL[selected.nivelRisco].toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelected(null)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={22} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.infoCardName}>{selected.nome}</Text>
                <View style={styles.infoCardRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.infoCardMeta}>
                    {selected.quantidadeOcorrencias} ocorrência
                    {selected.quantidadeOcorrencias !== 1 ? 's' : ''} registrada
                    {selected.quantidadeOcorrencias !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* ── Stats row ── */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="map-outline" size={15} color={Colors.primaryDark} />
          <Text style={styles.statValue}>{areas.length}</Text>
          <Text style={styles.statLabel}>Áreas monitoradas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="warning-outline" size={15} color={Colors.riskHigh} />
          <Text style={[styles.statValue, { color: Colors.riskHigh }]}>{totalAltoRisco}</Text>
          <Text style={styles.statLabel}>Alto risco</Text>
        </View>
      </View>

      {/* ── Legend ── */}
      <View style={styles.legend}>
        {RISCO_NIVEIS.map((nivel) => (
          <View key={nivel} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: RISCO_CORES[nivel] }]} />
            <Text style={styles.legendText}>
              {RISCO_EMOJI[nivel]} {RISCO_LABEL[nivel]} risco
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  mapContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#e8f0e8',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },

  // ── Info card ──
  infoCard: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  riscoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  riscoBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  infoCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoCardMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },

  // ── Legend ──
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#fafafa',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default MapaMonitoramento;
