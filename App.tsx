import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import { StructurePattern, Section, VocalType } from './src/types';
import { createSectionsFromPattern } from './src/data/structures';
import { generateTitle } from './src/utils/generator';
import { COLORS } from './src/utils/theme';

import HomeScreen from './src/screens/HomeScreen';
import StructureScreen from './src/screens/StructureScreen';
import StructureBuilderScreen from './src/screens/StructureBuilderScreen';
import WizardScreen from './src/screens/WizardScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import TitleScreen from './src/screens/TitleScreen';
import ExportScreen from './src/screens/ExportScreen';

type Screen = 'home' | 'structure' | 'builder' | 'wizard' | 'review' | 'title' | 'export';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [pattern, setPattern] = useState<StructurePattern | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [title, setTitle] = useState('');
  const [vocalType, setVocalType] = useState<VocalType>('male');

  const handleStart = (vocal: VocalType) => {
    setVocalType(vocal);
    setScreen('structure');
  };

  const handleSelectPattern = (p: StructurePattern) => {
    setPattern(p);
    setSections(createSectionsFromPattern(p));
    setTitle(generateTitle());
    setScreen('wizard');
  };

  const handleSelectZero = () => {
    setScreen('builder');
  };

  const handleBuilderComplete = (builtSections: Section[]) => {
    setPattern({
      id: 'zero',
      name: '陣形・自由',
      description: 'Custom structure',
      sections: builtSections.map((s) => s.type),
    });
    setSections(builtSections);
    setTitle(generateTitle());
    setScreen('wizard');
  };

  const handleWizardComplete = (updatedSections: Section[]) => {
    setSections(updatedSections);
    setScreen('review');
  };

  const handleRestart = () => {
    setScreen('home');
    setPattern(null);
    setSections([]);
    setTitle('');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onStart={handleStart} />;
      case 'structure':
        return (
          <StructureScreen
            onSelect={handleSelectPattern}
            onSelectZero={handleSelectZero}
            onBack={() => setScreen('home')}
          />
        );
      case 'builder':
        return (
          <StructureBuilderScreen
            onComplete={handleBuilderComplete}
            onBack={() => setScreen('structure')}
          />
        );
      case 'wizard':
        return (
          <WizardScreen
            sections={sections}
            onComplete={handleWizardComplete}
            onBack={() => setScreen(pattern?.id === 'zero' ? 'builder' : 'structure')}
          />
        );
      case 'review':
        return (
          <ReviewScreen
            sections={sections}
            onUpdate={setSections}
            onNext={() => setScreen('title')}
            onBack={() => setScreen('wizard')}
          />
        );
      case 'title':
        return (
          <TitleScreen
            title={title}
            onUpdate={setTitle}
            onNext={() => setScreen('export')}
            onBack={() => setScreen('review')}
          />
        );
      case 'export':
        return (
          <ExportScreen
            title={title}
            sections={sections}
            vocalType={vocalType}
            onBack={() => setScreen('title')}
            onRestart={handleRestart}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});
