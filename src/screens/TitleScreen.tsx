import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { generateTitle } from '../utils/generator';

interface Props {
  title: string;
  onUpdate: (title: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TitleScreen({ title, onUpdate, onNext, onBack }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);

  const handleRegenerate = () => {
    const newTitle = generateTitle();
    onUpdate(newTitle);
    setEditText(newTitle);
  };

  const handleSave = () => {
    onUpdate(editText.trim());
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>◀ 帰陣</Text>
        </TouchableOpacity>
        <Text style={styles.title}>タイトル命名</Text>
        <Text style={styles.subtitle}>この曲の名を叫べ！</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleDisplay}>
          <Text style={styles.titleLabel}>/// 生成されたタイトル ///</Text>
          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.titleInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                onSubmitEditing={handleSave}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>決定</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setEditText(title); setIsEditing(true); }}>
              <Text style={styles.titleValue}>{title}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.titleHint}>タップして直接編集</Text>
        </View>

        <TouchableOpacity style={styles.regenBtn} onPress={handleRegenerate}>
          <Text style={styles.regenIcon}>↻</Text>
          <Text style={styles.regenText}>再生成だ！</Text>
        </TouchableOpacity>

        <View style={styles.formulaBox}>
          <Text style={styles.formulaLabel}>/// 命名の法則 ///</Text>
          <Text style={styles.formulaText}>
            ［形容詞・称号］＋［侍の名・概念］{'\n'}
            例：黒き侍ヤスケ、炎の戦士伝説
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>出力開始 → EXPORT ▶</Text>
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
    color: COLORS.samuraiGold,
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
    padding: 24,
    justifyContent: 'center',
  },
  titleDisplay: {
    borderWidth: 2,
    borderColor: COLORS.samuraiGold,
    backgroundColor: COLORS.samuraiGoldDim,
    borderRadius: 4,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  titleLabel: {
    color: COLORS.samuraiGold,
    ...FONTS.small,
    letterSpacing: 2,
    marginBottom: 16,
  },
  titleValue: {
    color: COLORS.samuraiGold,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  titleHint: {
    color: COLORS.textDim,
    ...FONTS.small,
    marginTop: 12,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  titleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.samuraiGold,
    backgroundColor: COLORS.bgCardAlt,
    color: COLORS.samuraiGold,
    borderRadius: 2,
    padding: 12,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  saveBtn: {
    borderWidth: 1,
    borderColor: COLORS.samuraiGold,
    backgroundColor: COLORS.samuraiGoldDim,
    borderRadius: 2,
    padding: 12,
  },
  saveBtnText: {
    color: COLORS.samuraiGold,
    fontWeight: '700',
    letterSpacing: 2,
  },
  regenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.steelBlue,
    backgroundColor: COLORS.steelBlueDim,
    borderRadius: 2,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  regenIcon: {
    color: COLORS.steelBlue,
    fontSize: 20,
  },
  regenText: {
    color: COLORS.steelBlue,
    fontWeight: '700',
    letterSpacing: 3,
  },
  formulaBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    borderRadius: 4,
    padding: 16,
  },
  formulaLabel: {
    color: COLORS.textDim,
    ...FONTS.small,
    letterSpacing: 2,
    marginBottom: 8,
  },
  formulaText: {
    color: COLORS.textSecondary,
    ...FONTS.mono,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    backgroundColor: COLORS.samuraiGoldDim,
    borderWidth: 2,
    borderColor: COLORS.samuraiGold,
    borderRadius: 2,
    padding: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.samuraiGold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 3,
  },
});
