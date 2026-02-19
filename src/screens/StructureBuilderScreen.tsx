import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { Section, SectionType } from '../types';
import {
  createSectionFromType,
  ALL_SECTION_TYPES,
  SECTION_CONFIG,
} from '../data/structures';

interface Props {
  onComplete: (sections: Section[]) => void;
  onBack: () => void;
}

const SECTION_COLORS: Record<SectionType, string> = {
  intro: COLORS.samuraiGold,
  verse: COLORS.textSecondary,
  'pre-chorus': COLORS.steelBlue,
  chorus: COLORS.crimson,
  bridge: '#b388ff',
  outro: COLORS.textDim,
};

export default function StructureBuilderScreen({ onComplete, onBack }: Props) {
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = (type: SectionType) => {
    setSections((prev) => [...prev, createSectionFromType(type, prev)]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const counts: Record<string, number> = {};
      return updated.map((s) => {
        counts[s.type] = (counts[s.type] || 0) + 1;
        const config = SECTION_CONFIG[s.type];
        const suffix = counts[s.type] > 1 ? ` ${counts[s.type]}` : '';
        return { ...s, label: `${config.label}${suffix}` };
      });
    });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    setSections((prev) => {
      const updated = [...prev];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      const counts: Record<string, number> = {};
      return updated.map((s) => {
        counts[s.type] = (counts[s.type] || 0) + 1;
        const config = SECTION_CONFIG[s.type];
        const suffix = counts[s.type] > 1 ? ` ${counts[s.type]}` : '';
        return { ...s, label: `${config.label}${suffix}` };
      });
    });
  };

  const handleComplete = () => {
    if (sections.length > 0) {
      onComplete(sections);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>◀ 帰陣</Text>
        </TouchableOpacity>
        <Text style={styles.title}>陣形・自由</Text>
        <Text style={styles.subtitle}>ブロックを組み合わせて陣形を組み立てよ！</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.sectionLabel}>/// パーツ追加 ///</Text>
        <View style={styles.palette}>
          {ALL_SECTION_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.paletteBtn, { borderColor: SECTION_COLORS[type] }]}
              onPress={() => addSection(type)}
            >
              <Text style={styles.palettePlus}>+</Text>
              <Text style={[styles.paletteBtnText, { color: SECTION_COLORS[type] }]}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>
          /// 陣形構成 ({sections.length} ブロック) ///
        </Text>

        {sections.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              上のパーツをタップして陣形を構築せよ！{'\n'}
              例: INTRO → CHORUS → VERSE → CHORUS
            </Text>
          </View>
        ) : (
          sections.map((section, i) => (
            <View
              key={`${i}-${section.type}`}
              style={[styles.blockRow, { borderLeftColor: SECTION_COLORS[section.type] }]}
            >
              <View style={styles.blockInfo}>
                <Text style={styles.blockIndex}>{i + 1}</Text>
                <View style={styles.blockLabelArea}>
                  <Text style={[styles.blockType, { color: SECTION_COLORS[section.type] }]}>
                    [{section.label.toUpperCase()}]
                  </Text>
                  <Text style={styles.blockMeta}>
                    {section.maxLines} lines
                  </Text>
                </View>
              </View>
              <View style={styles.blockActions}>
                <TouchableOpacity
                  style={styles.blockActionBtn}
                  onPress={() => moveSection(i, -1)}
                  disabled={i === 0}
                >
                  <Text style={[styles.blockActionText, i === 0 && styles.disabled]}>▲</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.blockActionBtn}
                  onPress={() => moveSection(i, 1)}
                  disabled={i === sections.length - 1}
                >
                  <Text style={[styles.blockActionText, i === sections.length - 1 && styles.disabled]}>▼</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.blockActionBtn}
                  onPress={() => removeSection(i)}
                >
                  <Text style={styles.blockRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {sections.length > 0 && (
          <View style={styles.flowPreview}>
            <Text style={styles.flowPreviewLabel}>/// 陣形フロー ///</Text>
            <View style={styles.flowContainer}>
              {sections.map((s, i) => (
                <View key={i} style={styles.flowItem}>
                  {i > 0 && <Text style={styles.arrow}>→</Text>}
                  <View style={[styles.flowBadge, { borderColor: SECTION_COLORS[s.type] }]}>
                    <Text style={[styles.flowBadgeText, { color: SECTION_COLORS[s.type] }]}>
                      {s.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, sections.length === 0 && styles.startButtonDisabled]}
          onPress={handleComplete}
          disabled={sections.length === 0}
        >
          <Text style={[styles.startButtonText, sections.length === 0 && styles.startButtonTextDisabled]}>
            作詞開始 → WIZARD ▶
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    padding: 20,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    marginBottom: 12,
  },
  backText: {
    color: COLORS.samuraiGold,
    ...FONTS.small,
    letterSpacing: 2,
  },
  title: {
    color: COLORS.crimson,
    ...FONTS.title,
  },
  subtitle: {
    color: COLORS.textSecondary,
    ...FONTS.small,
    letterSpacing: 2,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  sectionLabel: {
    color: COLORS.samuraiGold,
    ...FONTS.small,
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 4,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  paletteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
  },
  palettePlus: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  paletteBtnText: {
    ...FONTS.small,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textDim,
    ...FONTS.mono,
    textAlign: 'center',
    lineHeight: 20,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderRadius: 4,
    padding: 10,
    marginBottom: 6,
  },
  blockInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockIndex: {
    color: COLORS.textDim,
    ...FONTS.small,
    width: 20,
    textAlign: 'center',
  },
  blockLabelArea: {
    marginLeft: 8,
  },
  blockType: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
  },
  blockMeta: {
    color: COLORS.textDim,
    fontSize: 10,
    marginTop: 1,
  },
  blockActions: {
    flexDirection: 'row',
    gap: 4,
  },
  blockActionBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
  },
  blockActionText: {
    color: COLORS.steelBlue,
    fontSize: 12,
  },
  disabled: {
    color: COLORS.textDim,
    opacity: 0.3,
  },
  blockRemoveText: {
    color: COLORS.crimson,
    fontSize: 12,
    fontWeight: '700',
  },
  flowPreview: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 4,
    padding: 12,
  },
  flowPreviewLabel: {
    color: COLORS.textDim,
    ...FONTS.small,
    letterSpacing: 2,
    marginBottom: 8,
  },
  flowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  flowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  arrow: {
    color: COLORS.textDim,
    marginHorizontal: 4,
    fontSize: 12,
  },
  flowBadge: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: COLORS.crimsonDim,
  },
  flowBadgeText: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  startButton: {
    backgroundColor: COLORS.samuraiGoldDim,
    borderWidth: 2,
    borderColor: COLORS.samuraiGold,
    borderRadius: 2,
    padding: 14,
    alignItems: 'center',
  },
  startButtonDisabled: {
    borderColor: COLORS.textDim,
    backgroundColor: COLORS.bgCard,
  },
  startButtonText: {
    color: COLORS.samuraiGold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 3,
  },
  startButtonTextDisabled: {
    color: COLORS.textDim,
  },
});
