import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS, FONTS } from '../utils/theme';
import { Section, VocalType } from '../types';
import { generateSunoPrompt } from '../utils/generator';

interface Props {
  title: string;
  sections: Section[];
  vocalType: VocalType;
  onBack: () => void;
  onRestart: () => void;
}

export default function ExportScreen({ title, sections, vocalType, onBack, onRestart }: Props) {
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => generateSunoPrompt(title, sections, vocalType), [title, sections, vocalType]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>◀ 帰陣</Text>
        </TouchableOpacity>
        <Text style={styles.title}>最終出力</Text>
        <Text style={styles.subtitle}>ＡＩ音楽生成用プロンプト完成！</Text>
      </View>

      <View style={styles.vocalBadge}>
        <Text style={styles.vocalBadgeText}>
          ボーカル：{vocalType === 'male' ? '男性ボーカル' : '女性ボーカル'}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.promptBox}>
          <Text style={styles.promptText}>{prompt}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.copyButton, copied && styles.copyButtonDone]}
          onPress={handleCopy}
        >
          <Text style={[styles.copyButtonText, copied && styles.copyButtonTextDone]}>
            {copied ? '✓ コピー完了！' : 'コピーだ！'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartText}>↻ 新たなる出陣</Text>
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
  vocalBadge: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.samuraiGoldBorder,
    backgroundColor: COLORS.samuraiGoldDim,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  vocalBadgeText: {
    color: COLORS.samuraiGold,
    ...FONTS.small,
    letterSpacing: 2,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  promptBox: {
    borderWidth: 1,
    borderColor: COLORS.samuraiGoldBorder,
    backgroundColor: COLORS.bgCard,
    borderRadius: 4,
    padding: 16,
  },
  promptText: {
    color: COLORS.textPrimary,
    ...FONTS.mono,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  copyButton: {
    backgroundColor: COLORS.samuraiGoldDim,
    borderWidth: 2,
    borderColor: COLORS.samuraiGold,
    borderRadius: 2,
    padding: 14,
    alignItems: 'center',
  },
  copyButtonDone: {
    borderColor: COLORS.crimson,
    backgroundColor: COLORS.crimsonDim,
  },
  copyButtonText: {
    color: COLORS.samuraiGold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 3,
  },
  copyButtonTextDone: {
    color: COLORS.crimson,
  },
  restartButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    padding: 12,
    alignItems: 'center',
  },
  restartText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
