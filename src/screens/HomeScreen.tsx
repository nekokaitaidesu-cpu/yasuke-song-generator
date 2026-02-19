import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { VocalType } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  onStart: (vocalType: VocalType) => void;
}

export default function HomeScreen({ onStart }: Props) {
  const [vocalType, setVocalType] = useState<VocalType>('male');

  return (
    <View style={styles.container}>
      <View style={styles.scanlineOverlay} />

      <View style={styles.headerArea}>
        <Text style={styles.systemLabel}>/// 侍システム起動完了 ///</Text>
        <View style={styles.divider} />
        <Text style={styles.title}>YASUKE</Text>
        <Text style={styles.titleSub}>SAMURAI SONG</Text>
        <View style={styles.divider} />
        <Text style={styles.version}>弐〇壱壱年 — 戦国ユーロビートプロトコル</Text>
      </View>

      <View style={styles.descArea}>
        <Text style={styles.descText}>
          {'> 黒き侍 ヤスケ...'}
        </Text>
        <Text style={styles.descText}>
          {'  時代を駆け抜けた伝説...'}
        </Text>
        <Text style={styles.descSpacer}>{''}</Text>
        <Text style={styles.descDetail}>
          {'  イニシャルＤ風ユーロビート × 戦国時代'}
        </Text>
        <Text style={styles.descDetail}>
          {'  黒き侍ヤスケの歌詞を作れ！'}
        </Text>
        <Text style={styles.descDetail}>
          {'  陣形を選び、歌詞を構築し、'}
        </Text>
        <Text style={styles.descDetail}>
          {'  ＡＩ生成用プロンプトを出力せよ！'}
        </Text>
      </View>

      {/* ボーカルタイプ選択 */}
      <View style={styles.vocalSelector}>
        <Text style={styles.vocalLabel}>/// ボーカルタイプを選べ ///</Text>
        <View style={styles.vocalButtons}>
          <TouchableOpacity
            style={[
              styles.vocalBtn,
              vocalType === 'male' && styles.vocalBtnActive,
            ]}
            onPress={() => setVocalType('male')}
          >
            <Text style={[
              styles.vocalBtnText,
              vocalType === 'male' && styles.vocalBtnTextActive,
            ]}>
              ◉ 男性ボーカル
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.vocalBtn,
              vocalType === 'female' && styles.vocalBtnActive,
            ]}
            onPress={() => setVocalType('female')}
          >
            <Text style={[
              styles.vocalBtnText,
              vocalType === 'female' && styles.vocalBtnTextActive,
            ]}>
              ◉ 女性ボーカル
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={() => onStart(vocalType)}>
        <Text style={styles.startButtonText}>▶ 出陣開始</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>[ 侍よ、ヤスケの伝説を刻め ]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scanlineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: COLORS.samuraiGold,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  systemLabel: {
    color: COLORS.samuraiGold,
    ...FONTS.small,
    letterSpacing: 3,
    marginBottom: 12,
  },
  divider: {
    width: width * 0.6,
    height: 1,
    backgroundColor: COLORS.samuraiGoldBorder,
    marginVertical: 8,
  },
  title: {
    color: COLORS.samuraiGold,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 14,
    marginVertical: 2,
  },
  titleSub: {
    color: COLORS.crimson,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 6,
    marginBottom: 2,
  },
  version: {
    color: COLORS.textDim,
    ...FONTS.small,
    letterSpacing: 2,
    marginTop: 4,
  },
  descArea: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.samuraiGoldBorder,
    backgroundColor: COLORS.samuraiGoldDim,
    borderRadius: 4,
  },
  descText: {
    color: COLORS.samuraiGold,
    ...FONTS.mono,
    lineHeight: 20,
    marginBottom: 2,
  },
  descSpacer: {
    height: 6,
  },
  descDetail: {
    color: COLORS.textDim,
    ...FONTS.mono,
    lineHeight: 18,
  },
  vocalSelector: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    borderRadius: 4,
  },
  vocalLabel: {
    color: COLORS.samuraiGold,
    ...FONTS.small,
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  vocalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  vocalBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: COLORS.bgCardAlt,
  },
  vocalBtnActive: {
    borderColor: COLORS.samuraiGold,
    backgroundColor: COLORS.samuraiGoldDim,
  },
  vocalBtnText: {
    color: COLORS.textSecondary,
    ...FONTS.small,
    letterSpacing: 1,
    fontWeight: '600',
  },
  vocalBtnTextActive: {
    color: COLORS.samuraiGold,
    fontWeight: '700',
  },
  startButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: COLORS.samuraiGold,
    backgroundColor: COLORS.samuraiGoldDim,
    borderRadius: 2,
    marginBottom: 24,
  },
  startButtonText: {
    color: COLORS.samuraiGold,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
  },
  footer: {
    color: COLORS.textDim,
    ...FONTS.small,
    letterSpacing: 2,
  },
});
