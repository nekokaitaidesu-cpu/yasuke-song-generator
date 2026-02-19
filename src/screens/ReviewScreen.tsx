import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { Section } from '../types';
import { getCandidatesForSection } from '../utils/generator';

interface Props {
  sections: Section[];
  onUpdate: (sections: Section[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ReviewScreen({ sections, onUpdate, onNext, onBack }: Props) {
  const [editModal, setEditModal] = useState<{
    sectionIdx: number;
    lineIdx: number;
  } | null>(null);
  const [editText, setEditText] = useState('');
  const [rerollCandidates, setRerollCandidates] = useState<string[]>([]);

  const openEdit = (si: number, li: number) => {
    setEditModal({ sectionIdx: si, lineIdx: li });
    setEditText(sections[si].lines[li]);
    setRerollCandidates(getCandidatesForSection(sections[si].type, li));
  };

  const saveLine = (text: string) => {
    if (!editModal) return;
    const updated = [...sections];
    updated[editModal.sectionIdx] = {
      ...updated[editModal.sectionIdx],
      lines: updated[editModal.sectionIdx].lines.map((l, i) =>
        i === editModal.lineIdx ? text : l
      ),
    };
    onUpdate(updated);
    setEditModal(null);
  };

  const rerollCandidatesRefresh = () => {
    if (!editModal) return;
    setRerollCandidates(
      getCandidatesForSection(sections[editModal.sectionIdx].type, editModal.lineIdx)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>◀ 帰陣</Text>
        </TouchableOpacity>
        <Text style={styles.title}>最終確認</Text>
        <Text style={styles.subtitle}>歌詞を確認し、修正せよ！</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {sections.map((section, si) => (
          <View key={si} style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>[{section.label}]</Text>
              <View style={styles.sectionTypeBadge}>
                <Text style={styles.sectionTypeText}>{section.type.toUpperCase()}</Text>
              </View>
            </View>
            {section.metaTags.map((tag, ti) => (
              <Text key={ti} style={styles.metaTag}>{tag}</Text>
            ))}
            {section.lines.map((line, li) => (
              <TouchableOpacity
                key={li}
                style={styles.lineRow}
                onPress={() => openEdit(si, li)}
              >
                <Text style={styles.lineNumber}>{li + 1}</Text>
                <Text
                  style={[styles.lineText, !line.trim() && styles.lineTextEmpty]}
                  numberOfLines={2}
                >
                  {line.trim() || '（空欄 — タップして修正）'}
                </Text>
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>タイトル決定 → TITLE ▶</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal visible={editModal !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>/// 歌詞修正 ///</Text>

            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
              placeholder="魂の歌詞を入力..."
              placeholderTextColor={COLORS.textDim}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={() => saveLine(editText)}
              >
                <Text style={styles.modalSaveText}>決定</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModal(null)}
              >
                <Text style={styles.modalCancelText}>中止</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.rerollLabel}>/// 別の候補 ///</Text>
            {rerollCandidates.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.rerollBtn}
                onPress={() => saveLine(c)}
              >
                <Text style={styles.rerollText}>{c}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.rerollRefresh} onPress={rerollCandidatesRefresh}>
              <Text style={styles.rerollRefreshText}>↻ もっと見せろ！</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  contentInner: {
    padding: 16,
  },
  sectionBlock: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionLabel: {
    color: COLORS.samuraiGold,
    ...FONTS.subtitle,
    flex: 1,
  },
  sectionTypeBadge: {
    backgroundColor: COLORS.samuraiGoldDim,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionTypeText: {
    color: COLORS.samuraiGold,
    fontSize: 10,
    letterSpacing: 1,
  },
  metaTag: {
    color: COLORS.textDim,
    ...FONTS.small,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 2,
    padding: 8,
    marginTop: 4,
  },
  lineNumber: {
    color: COLORS.textDim,
    width: 20,
    ...FONTS.small,
    textAlign: 'center',
  },
  lineText: {
    color: COLORS.textPrimary,
    ...FONTS.body,
    flex: 1,
    marginHorizontal: 8,
  },
  lineTextEmpty: {
    color: COLORS.textDim,
    fontStyle: 'italic',
  },
  editIcon: {
    color: COLORS.samuraiGold,
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 2,
    borderTopColor: COLORS.samuraiGold,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    color: COLORS.samuraiGold,
    ...FONTS.small,
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.samuraiGoldBorder,
    backgroundColor: COLORS.bgCardAlt,
    color: COLORS.textPrimary,
    borderRadius: 2,
    padding: 12,
    ...FONTS.body,
    minHeight: 48,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: COLORS.samuraiGoldDim,
    borderWidth: 1,
    borderColor: COLORS.samuraiGold,
    borderRadius: 2,
    padding: 10,
    alignItems: 'center',
  },
  modalSaveText: {
    color: COLORS.samuraiGold,
    fontWeight: '700',
    letterSpacing: 2,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    padding: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  rerollLabel: {
    color: COLORS.steelBlue,
    ...FONTS.small,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  rerollBtn: {
    borderWidth: 1,
    borderColor: COLORS.steelBlueDim,
    borderRadius: 2,
    padding: 8,
    marginBottom: 4,
  },
  rerollText: {
    color: COLORS.textPrimary,
    ...FONTS.body,
  },
  rerollRefresh: {
    alignItems: 'center',
    padding: 8,
    marginTop: 4,
  },
  rerollRefreshText: {
    color: COLORS.steelBlue,
    ...FONTS.small,
    letterSpacing: 2,
  },
});
