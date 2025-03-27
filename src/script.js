// 基本設定
const LOOP_COUNT = 8;
const DEFAULT_SYNTHS = ['sine', 'square', 'triangle', 'sawtooth', 'pluck', 'fm', 'am', 'metal', 'kick', 'snare', 'hihat'];
const AVAILABLE_SYNTHS = [
  'sine', 'square', 'triangle', 'sawtooth', 
  'pluck', 'fm', 'am', 'metal', 
  'pulse', 'pwm', 'fatsawtooth', 'fatsquare', 
  'fatcustom', 'fatsine', 'fattriangle',
  'kick', 'snare', 'hihat'
];
const AVAILABLE_COLORS = [
  '#ff0000', '#ff7700', '#ffff00', '#00ff00', 
  '#00ffff', '#0077ff', '#0000ff', '#7700ff', 
  '#ff00ff', '#ff0077', '#ffffff', '#8800ff',
  '#ff8800', '#88ff00', '#00ff88', '#0088ff'
];
const SCALES = {
  'major': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  'minor': ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'],
  'pentatonic': ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
  'blues': ['C4', 'Eb4', 'F4', 'F#4', 'G4', 'Bb4', 'C5', 'Eb5'],
  // 追加スケール
  'dorian': ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4', 'C5'],         // ドリアン（ジャズでよく使われる）
  'lydian': ['C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5'],          // リディアン（浮遊感のある明るい響き）
  'mixolydian': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5'],      // ミクソリディアン（ロックやブルースに最適）
  'harmonic_minor': ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'B4', 'C5'], // ハーモニックマイナー（独特の異国感）
  'melodic_minor': ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'B4', 'C5'],   // メロディックマイナー（ジャズ理論の基礎）
  'chinese': ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],                      // 中国風五音階
  'japanese': ['C4', 'Db4', 'F4', 'G4', 'Bb4', 'C5'],                   // 日本風民謡音階
  'whole_tone': ['C4', 'D4', 'E4', 'F#4', 'G#4', 'A#4', 'C5'],          // 全音音階（ドビュッシーなど印象派）
  'diminished': ['C4', 'D4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'A4', 'B4', 'C5'] // ディミニッシュ（ジャズの即興に）
};

// リズムパターン（自動生成用）
const RHYTHM_PATTERNS = {
  'simple': [0, 0.25, 0.5, 0.75],
  'offbeat': [0.125, 0.375, 0.625, 0.875],
  'triplet': [0, 0.33, 0.66],
  'complex': [0, 0.125, 0.25, 0.5, 0.625, 0.75],
  'sparse': [0, 0.5],
  'dense': [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
  // 追加リズムパターン
  'swing': [0, 0.33, 0.5, 0.83],
  'waltz': [0, 0.33, 0.66],
  'broken': [0, 0.375, 0.5, 0.875],
  'syncopated': [0, 0.125, 0.375, 0.625, 0.75],
  'dotted': [0, 0.375, 0.5, 0.875],
  'minimal': [0, 0.75],
  'accent1': [0, 0, 0.25, 0.5, 0.75], // アクセント（最初の音を強調）
  'accent3': [0, 0.5, 0.5, 0.75]      // アクセント（3拍目を強調）
};

// 音色タイプ別の最適なリズムパターン（音色の特性に合わせたパターン）
const SYNTH_TYPE_PATTERNS = {
  'kick': ['simple', 'sparse', 'minimal', 'accent1'],
  'snare': ['offbeat', 'accent3', 'broken'],
  'hihat': ['dense', 'offbeat', 'complex'],
  'sine': ['simple', 'triplet', 'waltz', 'minimal'],
  'square': ['simple', 'complex', 'broken'],
  'sawtooth': ['complex', 'syncopated', 'dense'],
  'triangle': ['triplet', 'waltz', 'swing'],
  'pluck': ['broken', 'accent1', 'dotted'],
  'fm': ['complex', 'syncopated', 'accent3'],
  'am': ['swing', 'dotted', 'syncopated'],
  'metal': ['dense', 'syncopated', 'complex'],
  'fat': ['minimal', 'simple', 'accent1']
};

// コード進行パターン
const CHORD_PROGRESSIONS = {
  'pop': [0, 3, 4, 0], // I-IV-V-I
  'fifties': [0, 3, 4, 3], // I-IV-V-IV
  'blues': [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 0], // 12小節ブルース
  'jazz': [1, 4, 0, 3], // II-V-I-IV
  'minor': [5, 3, 4, 5], // VI-IV-V-VI (マイナー)
  'sad': [0, 5, 3, 4]  // I-VI-IV-V
};

// カスタム音色設定
let customSounds = DEFAULT_SYNTHS.map((type, i) => ({
  id: i,
  name: type.charAt(0).toUpperCase() + type.slice(1), // 頭文字を大文字に
  synthType: type,
  colorIndex: i % AVAILABLE_COLORS.length, // 色のインデックス
  color: AVAILABLE_COLORS[i % AVAILABLE_COLORS.length]
}));

// アプリケーション状態
let appState = {
  started: false,
  bpm: 120,
  loopLength: 1, // 小節数
  soundCount: 0,
  currentSynthType: 'sine',
  currentSynthIndex: 0,
  currentScale: 'pentatonic',
  visualIntensity: 0.5,
  reverbAmount: 0.5,
  delayAmount: 0,
  sounds: [],
  loops: [],
  recordingLoop: null,
  recordingMode: 'auto', // 'auto' または 'manual'
  modalOpen: false,
  compactMode: window.innerWidth < 600,
  editingSound: false,
  tempSounds: [], // 編集中の一時的な音色設定
  metronome: {
    active: false,
    pattern: 'click',
    volume: 0.5,
    currentBeat: -1
  },
  quantize: {
    active: false,
    grid: '8n',
    strength: 50,
    applyOnRecord: true,
    showGrid: false
  },
  selectedLoop: null // 選択されたループのインデックス
};

// 音楽関連の変数
let analyzer;
let synths = {};
let effects = {};
let currentLevel = 0;
let particles = [];
let synthColors = {};
let loopSequences = [];
let recordStartTime = 0;

function setup() {
  // loops配列の初期化
  appState.loops = Array(LOOP_COUNT).fill().map(() => ({
    active: false,
    recording: false,
    events: [],
    color: null,
    pattern: null,
    hasContent: false
  }));
  
  // sounds配列の初期化
  appState.sounds = customSounds;
  
  // p5.jsのキャンバスをcanvas-containerに配置
  const canvasContainer = document.getElementById('canvas-container');
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(canvasContainer);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Tone.jsの設定
  analyzer = new Tone.Analyser('waveform', 128);
  
  // エフェクトのセットアップ
  setupEffects();
  
  // シンセサイザーのセットアップ
  setupSynths();
  
  // メトロノーム音のセットアップ
  setupMetronomeSounds();
  
  // 色の設定
  setupColors();
  
  // UIの初期化
  initializeUI();
  
  // イベントリスナー
  document.getElementById('start').addEventListener('click', toggleStart);
  document.getElementById('clear-all').addEventListener('click', clearAllLoops);
  document.getElementById('bpm-slider').addEventListener('input', updateBPM);
  document.getElementById('loop-length-slider').addEventListener('input', updateLoopLength);
  document.getElementById('reverb-slider').addEventListener('input', updateReverb);
  document.getElementById('delay-slider').addEventListener('input', updateDelay);
  document.getElementById('visual-slider').addEventListener('input', updateVisualIntensity);
  document.getElementById('mode-auto').addEventListener('click', () => setRecordingMode('auto'));
  document.getElementById('mode-manual').addEventListener('click', () => setRecordingMode('manual'));
  document.getElementById('toggle-panel').addEventListener('click', toggleCompactMode);
  document.getElementById('help-toggle').addEventListener('click', toggleHelp);
  document.getElementById('generate-sample').addEventListener('click', generateSample);
  
  // 設定管理のイベントリスナー
  document.getElementById('export-settings').addEventListener('click', showExportPanel);
  document.getElementById('import-settings').addEventListener('click', showImportPanel);
  document.getElementById('copy-json').addEventListener('click', copyExportJson);
  document.getElementById('download-json').addEventListener('click', downloadSettings);
  document.getElementById('load-json').addEventListener('click', loadSettings);
  document.getElementById('select-file').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  
  document.getElementById('import-file').addEventListener('change', handleFileSelect);
  
  // QRコード関連のイベントリスナー
  document.getElementById('generate-qrcode').addEventListener('click', generateQRCode);
  document.getElementById('download-qrcode').addEventListener('click', downloadQRCode);
  document.getElementById('share-qrcode').addEventListener('click', shareQRCode);
  document.getElementById('scan-qrcode').addEventListener('click', startQRScanner);
  document.getElementById('stop-scanning').addEventListener('click', stopQRScanner);
  
  // メトロノーム関連のイベントリスナー
  document.getElementById('metronome-toggle').addEventListener('click', toggleMetronome);
  document.getElementById('metronome-pattern').addEventListener('click', toggleMetronomePatternSelect);
  document.getElementById('metronome-volume').addEventListener('input', updateMetronomeVolume);
  document.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.addEventListener('click', selectMetronomePattern);
  });
  
  // クオンタイズ関連のイベントリスナー
  document.getElementById('quantize-toggle').addEventListener('click', toggleQuantize);
  document.getElementById('quantize-grid-4n').addEventListener('click', () => setQuantizeGrid('4n'));
  document.getElementById('quantize-grid-8n').addEventListener('click', () => setQuantizeGrid('8n'));
  document.getElementById('quantize-grid-16n').addEventListener('click', () => setQuantizeGrid('16n'));
  document.getElementById('quantize-grid-8t').addEventListener('click', () => setQuantizeGrid('8t'));
  document.getElementById('quantize-strength').addEventListener('input', updateQuantizeStrength);
  document.getElementById('apply-on-record').addEventListener('click', () => setQuantizeApplyTiming(true));
  document.getElementById('apply-after').addEventListener('click', () => setQuantizeApplyTiming(false));
  document.getElementById('show-grid').addEventListener('change', toggleGridDisplay);
  document.getElementById('apply-quantize').addEventListener('click', applyQuantizeToLoop);
  
  // ウィンドウリサイズ時のイベントリスナー
  window.addEventListener('resize', windowResized);
  
  // キーボードショートカットのイベントリスナー
  window.addEventListener('keydown', handleKeyboardShortcut);
  
  // ビートインジケータの初期化
  createBeatIndicator();
  
  // スケールセレクターのイベントリスナーを追加
  document.getElementById('scale-selector').addEventListener('change', updateScale);
  // 初期値を設定
  document.getElementById('scale-selector').value = appState.currentScale;
  // 初期スケール情報を更新
  updateScaleInfo();
  
  // 録音ボタンのイベントリスナー（不具合修正）
  document.getElementById('record-audio').addEventListener('click', toggleRecording);
}

function draw() {
  background(0, 0.1);
  
  if (!appState.started) return;
  
  // グリッド線の描画（クオンタイズ機能が有効でグリッド表示が有効な場合）
  if (appState.quantize.enabled && appState.quantize.showGrid) {
    drawGridLines();
  }
  
  // 音量レベルの取得
  const waveform = analyzer.getValue();
  currentLevel = 0;
  for (let i = 0; i < waveform.length; i++) {
    currentLevel += Math.abs(waveform[i]);
  }
  currentLevel = currentLevel / waveform.length * appState.visualIntensity * 2;
  
  // パーティクルの更新と描画
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update(currentLevel * 10);
    p.display();
    
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // 音楽の視覚化
  drawWaveform(waveform);
  
  // アクティブなループの視覚化
  drawActiveLoops();
  
  // 録音中のループのビジュアライザー
  if (appState.recordingLoop !== null) {
    drawRecordingLoop();
  }
}

function setupEffects() {
  // リバーブ
  effects.reverb = new Tone.Reverb({
    decay: 3,
    wet: appState.reverbAmount
  }).toDestination();
  
  // ディレイ
  effects.delay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.3,
    wet: appState.delayAmount
  }).toDestination();
  
  // マスターチャンネル
  effects.master = new Tone.Channel().connect(analyzer);
  effects.master.connect(Tone.Destination);
  effects.master.connect(effects.reverb);
  effects.master.connect(effects.delay);
}

function setupSynths() {
  // 基本のシンセ
  synths.sine = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' }
  }).connect(effects.master);
  
  synths.square = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'square' }
  }).connect(effects.master);
  
  synths.triangle = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' }
  }).connect(effects.master);
  
  synths.sawtooth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sawtooth' }
  }).connect(effects.master);
  
  // 特殊なシンセ
  synths.pluck = new Tone.PluckSynth().connect(effects.master);
  
  synths.fm = new Tone.PolySynth(Tone.FMSynth).connect(effects.master);
  
  synths.am = new Tone.PolySynth(Tone.AMSynth).connect(effects.master);
  
  synths.metal = new Tone.PolySynth(Tone.MetalSynth, {
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      release: 0.1
    },
    harmonicity: 3.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).connect(effects.master);
  
  // 追加のシンセ
  synths.pulse = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'pulse' }
  }).connect(effects.master);
  
  synths.pwm = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'pwm' }
  }).connect(effects.master);
  
  synths.fatsawtooth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'fatsawtooth' }
  }).connect(effects.master);
  
  synths.fatsquare = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'fatsquare' }
  }).connect(effects.master);
  
  synths.fatsine = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'fatsine' }
  }).connect(effects.master);
  
  synths.fattriangle = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'fattriangle' }
  }).connect(effects.master);
  
  synths.fatcustom = new Tone.PolySynth(Tone.Synth, {
    oscillator: { 
      type: 'fatcustom',
      partials: [0.2, 0.4, 0.6, 0.8, 1]
    }
  }).connect(effects.master);
}

function setupColors() {
  // 各シンセに色を割り当て
  synthColors = {}; // 初期化
  
  customSounds.forEach((sound, i) => {
    // HTMLカラーコードをp5.jsのcolor関数に変換
    synthColors[sound.synthType] = color(sound.color);
  });
  
  // ループパッドの色を生成
  for (let i = 0; i < appState.loops.length; i++) {
    const hue = map(i, 0, appState.loops.length, 0, 360);
    appState.loops[i].color = color(hue, 80, 100);
  }
}

function initializeUI() {
  // ループパッドの生成
  const loopContainer = document.getElementById('loop-container');
  loopContainer.innerHTML = ''; // 既存の内容をクリア
  
  for (let i = 0; i < LOOP_COUNT; i++) {
    const pad = document.createElement('div');
    pad.className = 'loop-pad';
    pad.style.backgroundColor = `hsla(${hue(appState.loops[i].color)}, ${saturation(appState.loops[i].color)}%, ${brightness(appState.loops[i].color)}%, 0.2)`;
    pad.style.borderColor = `hsla(${hue(appState.loops[i].color)}, ${saturation(appState.loops[i].color)}%, ${brightness(appState.loops[i].color)}%, 0.7)`;
    pad.dataset.index = i;
    pad.addEventListener('click', handleLoopPadClick);
    
    // 右クリックメニューの追加
    pad.addEventListener('contextmenu', showLoopPadMenu);
    
    // モバイル用ロングタップの処理
    let longTapTimer;
    let longTapAnimationFrame;
    pad.addEventListener('touchstart', (e) => {
      const targetPad = e.target;
      
      // ロングタップの視覚的フィードバックを開始
      targetPad.classList.add('long-tap-active');
      
      // ロングタップのプログレスアニメーション
      const startTime = Date.now();
      const longTapDuration = 500; // 500ミリ秒のロングタップ
      
      function animateLongTap() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / longTapDuration, 1);
        
        // プログレスインジケーターのスタイルを更新
        targetPad.style.backgroundImage = `radial-gradient(circle, rgba(255,255,255,0.3) ${progress * 100}%, transparent ${progress * 100}%)`;
        
        if (progress < 1) {
          longTapAnimationFrame = requestAnimationFrame(animateLongTap);
        }
      }
      
      // アニメーションを開始
      longTapAnimationFrame = requestAnimationFrame(animateLongTap);
      
      longTapTimer = setTimeout(() => {
        const loopIndex = parseInt(targetPad.dataset.index);
        // 内容の有無にかかわらず選択機能を有効化
        e.preventDefault(); // デフォルトのタッチイベントをキャンセル
        
        // ループを選択
        selectLoop(loopIndex);
        
        // ロングタップ完了時の視覚効果
        targetPad.classList.remove('long-tap-active');
        targetPad.classList.add('long-tap-complete');
        setTimeout(() => {
          targetPad.classList.remove('long-tap-complete');
          targetPad.style.backgroundImage = '';
        }, 300);
        
        // 内容がある場合のみメニューを表示
        if (appState.loops[loopIndex].hasContent) {
          // タッチ位置を取得してメニューを表示
          const touch = e.touches[0];
          const touchX = touch.pageX;
          const touchY = touch.pageY;
          
          const menu = document.getElementById('loop-pad-menu');
          menu.dataset.loopIndex = loopIndex;
          menu.style.left = `${touchX}px`;
          menu.style.top = `${touchY}px`;
          menu.style.display = 'block';
          
          // バイブレーションAPIが利用可能ならフィードバックを提供
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }, longTapDuration);
    });
    
    pad.addEventListener('touchend', () => {
      clearTimeout(longTapTimer);
      cancelAnimationFrame(longTapAnimationFrame);
      pad.classList.remove('long-tap-active');
      pad.style.backgroundImage = '';
    });
    
    pad.addEventListener('touchmove', () => {
      clearTimeout(longTapTimer);
      cancelAnimationFrame(longTapAnimationFrame);
      pad.classList.remove('long-tap-active');
      pad.style.backgroundImage = '';
    });
    
    loopContainer.appendChild(pad);
  }
  
  // 右クリックメニューの作成
  createLoopPadMenu();
  
  // 音色パレットの生成
  updateSoundPalette();
  
  // イベントリスナーの追加
  document.getElementById('edit-sounds').addEventListener('click', openSoundEditor);
  document.getElementById('modal-close').addEventListener('click', closeSoundEditor);
  document.getElementById('save-sound-settings').addEventListener('click', saveSoundSettings);
  document.getElementById('reset-sound-settings').addEventListener('click', resetSoundSettings);
  
  // メニュー外クリックでメニューを閉じる
  document.addEventListener('click', hideLoopPadMenu);
  document.addEventListener('touchstart', (e) => {
    const menu = document.getElementById('loop-pad-menu');
    if (menu && menu.style.display === 'block') {
      // メニュー内のタッチでなければメニューを閉じる
      if (!menu.contains(e.target)) {
        hideLoopPadMenu();
      }
    }
  });
}

function updateSoundPalette() {
  const soundPalette = document.getElementById('sound-palette');
  soundPalette.innerHTML = ''; // 既存の内容をクリア
  
  for (let i = 0; i < customSounds.length; i++) {
    const sound = customSounds[i];
    const button = document.createElement('div');
    button.className = 'sound-button';
    
    // カスタム色を使用
    button.style.backgroundColor = sound.color;
    
    button.dataset.index = i;
    button.dataset.synth = sound.synthType;
    button.addEventListener('click', selectSynth);
    
    if (i === appState.currentSynthIndex) {
      button.classList.add('selected');
    }
    
    // ラベルを追加（オプション）
    button.title = sound.name;
    
    soundPalette.appendChild(button);
  }
}

function handleLoopPadClick(event) {
  if (!appState.started) return;
  
  const loopIndex = parseInt(event.target.dataset.index);
  const loop = appState.loops[loopIndex];
  
  // 右クリックの場合はコンテキストメニューを表示せず、ループを選択
  if (event.button === 2) {
    event.preventDefault();
    selectLoop(loopIndex);
    return;
  }
  
  // イベントタイプを判断（ロングクリックか通常クリックか）
  if (loop.hasContent && !loop.recording) {
    // 既に内容がある場合は再生/停止を切り替え
    toggleLoopPlayback(loopIndex);
  } else {
    // 内容がないか録音中の場合は録音開始/停止
    toggleLoopRecording(event);
  }
}

function toggleLoopPlayback(loopIndex) {
  const loop = appState.loops[loopIndex];
  
  if (loop.active) {
    stopLoop(loopIndex);
  } else {
    startLoop(loopIndex);
  }
}

function drawWaveform(waveform) {
  noFill();
  strokeWeight(2);
  
  // メインの波形
  stroke(frameCount % 360, 80, 100, 0.5);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    const x = map(i, 0, waveform.length, 0, width);
    const y = map(waveform[i], -1, 1, height/2 - 100 - currentLevel * 200, height/2 + 100 + currentLevel * 200);
    vertex(x, y);
  }
  endShape();
  
  // 補助の波形
  stroke(frameCount % 360, 80, 100, 0.3);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    const x = map(i, 0, waveform.length, 0, width);
    const y = map(waveform[i], -1, 1, height/2 - 50 - currentLevel * 100, height/2 + 50 + currentLevel * 100);
    vertex(x, y);
  }
  endShape();
}

function drawActiveLoops() {
  // アクティブなループの視覚化
  for (let i = 0; i < appState.loops.length; i++) {
    const loop = appState.loops[i];
    if (loop.active && loop.pattern) {
      const loopDuration = appState.loopLength * 60 / appState.bpm;
      
      // 現在の再生位置を計算（Transport.secondsは絶対時間なので、ループ内での相対位置を計算）
      let transportTime = Tone.Transport.seconds;
      
      // ループの開始時間からの相対位置を計算
      let relativePosition = (transportTime % loopDuration) / loopDuration;
      
      // 進捗の計算を補正
      const progress = Math.max(0, Math.min(1, relativePosition));
      
      noFill();
      strokeWeight(3);
      stroke(hue(loop.color), saturation(loop.color), brightness(loop.color), 0.7);
      
      const size = 100 + i * 30;
      const x = width / 2;
      const y = height / 2;
      
      // ループの背景円を描画
      noFill();
      strokeWeight(1);
      stroke(hue(loop.color), saturation(loop.color), brightness(loop.color), 0.3);
      ellipse(x, y, size, size);
      
      // 進捗を表す弧を描画
      strokeWeight(3);
      stroke(hue(loop.color), saturation(loop.color), brightness(loop.color), 0.7);
      arc(x, y, size, size, 0, TWO_PI * progress);
      
      // ループイベントの表示
      for (const event of loop.events) {
        const eventProgress = event.time / loopDuration;
        const angle = TWO_PI * eventProgress - HALF_PI;
        const eventX = x + cos(angle) * (size / 2);
        const eventY = y + sin(angle) * (size / 2);
        
        // イベントに保存された音色を使用
        let eventColor;
        try {
          const soundConfig = customSounds.find(s => s.synthType === event.synthType);
          eventColor = soundConfig ? color(soundConfig.color) : color(255);
        } catch (e) {
          eventColor = color(255);
        }
        
        // イベントが再生されているかどうかを判断
        const isCurrentlyPlaying = Math.abs(eventProgress - progress) < 0.03 || 
                                 (eventProgress > 0.97 && progress < 0.03);
        
        // イベントマーカーの表示
        fill(red(eventColor), green(eventColor), blue(eventColor), isCurrentlyPlaying ? 255 : 200);
        noStroke();
        ellipse(eventX, eventY, isCurrentlyPlaying ? 14 : 10, isCurrentlyPlaying ? 14 : 10);
      }
      
      // 現在再生位置の表示
      const cursorAngle = TWO_PI * progress - HALF_PI;
      const cursorX = x + cos(cursorAngle) * (size / 2);
      const cursorY = y + sin(cursorAngle) * (size / 2);
      
      fill(255);
      noStroke();
      ellipse(cursorX, cursorY, 8, 8);
    }
  }
}

function drawRecordingLoop() {
  // 録音中のループの視覚化
  const loop = appState.loops[appState.recordingLoop];
  const elapsedTime = Tone.Transport.seconds - recordStartTime;
  const loopDuration = appState.loopLength * 60 / appState.bpm;
  const progress = elapsedTime / loopDuration;
  
  // 自動録音モードで時間が経過した場合は録音停止
  if (progress >= 1 && appState.recordingMode === 'auto') {
    stopRecording();
    return;
  }
  
  noFill();
  strokeWeight(5);
  stroke(hue(loop.color), saturation(loop.color), brightness(loop.color), 0.8);
  
  const size = 150;
  const x = width / 2;
  const y = height / 2;
  
  arc(x, y, size, size, 0, TWO_PI * progress);
  
  // 手動モードの場合はプログレスを超えても表示
  if (appState.recordingMode === 'manual' && progress >= 1) {
    const cycles = Math.floor(progress);
    arc(x, y, size, size, 0, TWO_PI * (progress - cycles));
  }
}

function mousePressed() {
  if (!appState.started) return;
  
  // クリックがコントロールパネル内かどうかをチェック
  const controlPanel = document.querySelector('.control-panel');
  const modalContent = document.querySelector('.modal-content');
  
  if (controlPanel && modalContent) {
    const controlPanelRect = controlPanel.getBoundingClientRect();
    const modalRect = modalContent.getBoundingClientRect();
    
    // コントロールパネル内またはモーダル内のクリックでは音を鳴らさない
    const isInControlPanel = 
      mouseX >= controlPanelRect.left && 
      mouseX <= controlPanelRect.right && 
      mouseY >= controlPanelRect.top && 
      mouseY <= controlPanelRect.bottom;
      
    const isInModal = 
      document.getElementById('sound-editor-modal').classList.contains('active') &&
      mouseX >= modalRect.left && 
      mouseX <= modalRect.right && 
      mouseY >= modalRect.top && 
      mouseY <= modalRect.bottom;
      
    if (isInControlPanel || isInModal) {
      return; // コントロールパネルまたはモーダル内のクリックでは処理を中断
    }
  }
  
  // 音を鳴らす
  playSound(mouseX, mouseY);
  
  // 録音中の場合はイベントを記録
  if (appState.recordingLoop !== null) {
    const elapsedTime = Tone.Transport.seconds - recordStartTime;
    const loopDuration = appState.loopLength * 60 / appState.bpm;
    
    // 手動モードではタイムポジションを計算
    let timePosition = elapsedTime;
    if (appState.recordingMode === 'manual' && elapsedTime > loopDuration) {
      timePosition = elapsedTime % loopDuration;
    }
    
    // クオンタイズ処理（有効かつ録音時適用の場合）
    if (appState.quantize.enabled && appState.quantize.applyOnRecord) {
      timePosition = quantizeEvent(timePosition);
    }
    
    appState.loops[appState.recordingLoop].events.push({
      time: timePosition,
      x: mouseX / width,
      y: mouseY / height,
      synthType: appState.currentSynthType
    });
  }
}

function mouseMoved() {
  if (!appState.started) return;
  
  // マウスの動きに応じてパーティクルを追加
  if (frameCount % 5 === 0) {
    particles.push(new Particle(mouseX, mouseY, synthColors[appState.currentSynthType]));
  }
}

function playSound(x, y) {
  // ドラム音かどうかを判断
  const isDrum = ['kick', 'snare', 'hihat'].includes(appState.currentSynthType);
  
  let note, synth;
  
  if (isDrum) {
    // ドラム音の場合は音階を使わず、単にドラム音を鳴らす
    synth = synths[appState.currentSynthType];
    // Y座標で微妙にピッチを変化させる（キックのみ）
    if (appState.currentSynthType === 'kick') {
      const pitchVariation = map(y, 0, height, 'C1', 'G1');
      note = pitchVariation;
    } else {
      note = 'C2'; // ドラム音の場合はノートはあまり重要ではない
    }
  } else {
    // 通常の音色の場合は従来通り位置から音を決定
    const scaleNotes = SCALES[appState.currentScale];
    const noteIndex = floor(map(y, 0, height, 0, scaleNotes.length));
    note = scaleNotes[constrain(noteIndex, 0, scaleNotes.length - 1)];
    synth = synths[appState.currentSynthType];
  }
  
  if (!synth) {
    console.error(`Synth type not found: ${appState.currentSynthType}`);
    return;
  }
  
  // 位置によって音量を調整
  const volume = map(x, 0, width, -10, 0);
  const velocityValue = map(volume, -10, 0, 0.1, 0.7);
  
  if (isDrum) {
    // ドラム音の場合は短い音にする
    if (appState.currentSynthType === 'hihat') {
      synth.triggerAttackRelease('16n', undefined, velocityValue);
    } else if (appState.currentSynthType === 'snare') {
      synth.triggerAttackRelease('8n', undefined, velocityValue);
    } else {
      synth.triggerAttackRelease(note, '8n', undefined, velocityValue);
    }
  } else if (appState.currentSynthType === 'pluck' || appState.currentSynthType === 'metal') {
    synth.triggerAttackRelease(note, "8n", undefined, velocityValue);
  } else {
    synth.triggerAttackRelease(note, "8n", undefined, velocityValue);
  }
  
  // パーティクルを追加
  const soundColor = customSounds[appState.currentSynthIndex].color;
  createParticles(x, y, color(soundColor), 10);
  
  // ビジュアルフィードバック
  currentLevel = 1;
}

function createParticles(x, y, particleColor, count) {
  for (let i = 0; i < count; i++) {
    const p = new Particle(x, y);
    p.color = particleColor || p.color;
    particles.push(p);
  }
}

function toggleStart() {
  if (!appState.started) {
    startApp();
    document.getElementById('start').textContent = '停止';
  } else {
    stopApp();
    document.getElementById('start').textContent = 'スタート';
  }
}

function startApp() {
  appState.started = true;
  Tone.start();
  Tone.Transport.start();
  
  // メトロノームが有効な場合、開始
  if (appState.metronome.active) {
    console.log('アプリ開始時にメトロノームを開始します');
    startMetronome();
  }
  
  // ビートインジケーター表示を更新
  updateBeatIndicatorVisibility();
}

function stopApp() {
  appState.started = false;
  Tone.Transport.stop();
  stopAllLoops();
  
  // ビートインジケータをリセット
  appState.metronome.currentBeat = -1;
  updateBeatIndicator(-1);
  console.log('アプリ停止: メトロノームリセット');
}

function toggleLoopRecording(event) {
  const loopIndex = parseInt(event.target.dataset.index);
  console.log(`ループパッド ${loopIndex} がクリックされました`);
  
  // 既に録音中のループがある場合は停止
  if (appState.recordingLoop !== null && appState.recordingLoop !== loopIndex) {
    // 現在の録音を終了し、新しい録音を開始する前に確認メッセージを表示
    if (confirm('別のループを録音中です。現在の録音を終了して新しいループの録音を開始しますか？')) {
      stopRecording();
      // 録音ボタンのテキストを更新
      const recordButton = document.getElementById('record-audio');
      if (recordButton) {
        recordButton.textContent = '録音開始';
        recordButton.classList.remove('recording');
      }
    } else {
      return; // キャンセルした場合は何もしない
    }
  }
  
  // このループが録音中の場合は録音を停止
  if (appState.recordingLoop === loopIndex) {
    stopRecording();
    // 録音ボタンのテキストを更新
    const recordButton = document.getElementById('record-audio');
    if (recordButton) {
      recordButton.textContent = '録音開始';
      recordButton.classList.remove('recording');
    }
    console.log(`ループ ${loopIndex} の録音を停止しました`);
    return;
  }
  
  // このループが既にアクティブな場合は非アクティブに
  if (appState.loops[loopIndex].active) {
    stopLoop(loopIndex);
    return;
  }
  
  // 録音を開始
  startRecording(loopIndex);
  
  // 録音ボタンのテキストを更新
  const recordButton = document.getElementById('record-audio');
  if (recordButton) {
    recordButton.textContent = '録音停止';
    recordButton.classList.add('recording');
  }
  
  console.log(`ループ ${loopIndex} の録音を開始しました`);
  
  // UIの更新
  updateLoopUI();
}

function startRecording(loopIndex) {
  // 既存のループデータをクリア
  appState.loops[loopIndex].events = [];
  appState.loops[loopIndex].recording = true;
  appState.recordingLoop = loopIndex;
  recordStartTime = Tone.Transport.seconds;
  
  // UIの更新
  updateLoopUI();
  
  // 録音開始の視覚的フィードバック
  const pad = document.querySelector(`.loop-pad[data-index="${loopIndex}"]`);
  if (pad) {
    pad.style.animation = 'pulse 1s infinite';
  }
}

function stopRecording() {
  if (appState.recordingLoop === null) return;
  
  const loopIndex = appState.recordingLoop;
  appState.loops[loopIndex].recording = false;
  
  // 録音終了の視覚的フィードバックを停止
  const pad = document.querySelector(`.loop-pad[data-index="${loopIndex}"]`);
  if (pad) {
    pad.style.animation = '';
  }
  
  // イベントがある場合はループを開始し、hasContentをtrueに
  if (appState.loops[loopIndex].events.length > 0) {
    appState.loops[loopIndex].hasContent = true;
    startLoop(loopIndex);
  }
  
  appState.recordingLoop = null;
  
  // UIの更新
  updateLoopUI();
}

function startLoop(loopIndex) {
  const loop = appState.loops[loopIndex];
  loop.active = true;
  
  // ループパターンを作成
  if (loopSequences[loopIndex]) {
    loopSequences[loopIndex].dispose();
  }
  
  const loopDuration = appState.loopLength * 60 / appState.bpm;
  
  loopSequences[loopIndex] = new Tone.Part((time, event) => {
    const synth = synths[event.synthType];
    if (!synth) {
      console.error(`Synth type not found in loop: ${event.synthType}`);
      return;
    }
    
    const scaleNotes = SCALES[appState.currentScale];
    const noteIndex = floor(map(event.y, 0, 1, 0, scaleNotes.length));
    const note = scaleNotes[constrain(noteIndex, 0, scaleNotes.length - 1)];
    
    // 音色と音量を調整
    const volume = map(event.x, 0, 1, -10, 0);
    
    if (event.synthType === 'pluck' || event.synthType === 'metal') {
      synth.triggerAttackRelease(note, "8n", time, map(volume, -10, 0, 0.1, 0.7));
    } else {
      synth.triggerAttackRelease(note, "8n", time, map(volume, -10, 0, 0.1, 0.7));
    }
    
    // パーティクルをスケジュール（次のフレームで）
    Tone.Draw.schedule(() => {
      const x = event.x * width;
      const y = event.y * height;
      // イベントに保存された音色を使用
      // ここで一時的に現在のシンセタイプを保存してイベントのシンセタイプに変更
      const originalSynthType = appState.currentSynthType;
      appState.currentSynthType = event.synthType;
      
      // パーティクル色の取得
      let eventColor;
      try {
        const soundConfig = customSounds.find(s => s.synthType === event.synthType);
        eventColor = color(soundConfig ? soundConfig.color : '#ffffff');
      } catch (e) {
        eventColor = color(255);
      }
      createParticles(x, y, eventColor, 5);
      
      // 元の音色タイプに戻す
      appState.currentSynthType = originalSynthType;
    }, time);
  }, loop.events);
  
  // ループを設定し開始
  loopSequences[loopIndex].loop = true;
  loopSequences[loopIndex].loopEnd = loopDuration;
  loopSequences[loopIndex].start(0);
  
  // ループパターンを保存
  loop.pattern = loopSequences[loopIndex];
  
  // UIの更新
  updateLoopUI();
}

function stopLoop(loopIndex) {
  appState.loops[loopIndex].active = false;
  
  if (loopSequences[loopIndex]) {
    loopSequences[loopIndex].stop();
    loopSequences[loopIndex].dispose();
  }
  
  // UIの更新
  updateLoopUI();
}

function stopAllLoops() {
  for (let i = 0; i < appState.loops.length; i++) {
    if (appState.loops[i].active) {
      stopLoop(i);
    }
  }
}

function clearAllLoops() {
  for (let i = 0; i < appState.loops.length; i++) {
    // まず再生を停止
    if (loopSequences[i]) {
      loopSequences[i].stop();
      loopSequences[i].dispose();
      loopSequences[i] = null;
    }
    
    // ループの状態をリセット
    appState.loops[i].active = false;
    appState.loops[i].recording = false;
    appState.loops[i].events = [];
    appState.loops[i].hasContent = false;
    appState.loops[i].pattern = null;
  }
  
  // 録音状態もリセット
  appState.recordingLoop = null;
  
  // UIの更新
  updateLoopUI();
}

function updateLoopUI() {
  const loopElements = document.querySelectorAll('.loop-pad');
  
  for (let i = 0; i < loopElements.length; i++) {
    const pad = loopElements[i];
    const loopIndex = parseInt(pad.dataset.index);
    const loop = appState.loops[loopIndex];
    
    // クラスのリセット
    pad.classList.remove('active', 'recording', 'has-content');
    
    // 背景色の設定
    let bgOpacity = 0.2;
    
    if (loop.recording) {
      pad.classList.add('recording');
      bgOpacity = 0.5;
    } else if (loop.active) {
      pad.classList.add('active');
      bgOpacity = 0.4;
    }
    
    if (loop.hasContent) {
      pad.classList.add('has-content');
    }
    
    pad.style.backgroundColor = `hsla(${hue(loop.color)}, ${saturation(loop.color)}%, ${brightness(loop.color)}%, ${bgOpacity})`;
    pad.style.borderColor = `hsla(${hue(loop.color)}, ${saturation(loop.color)}%, ${brightness(loop.color)}%, 0.7)`;
  }
}

function selectSynth(event) {
  const index = parseInt(event.target.dataset.index);
  const synthType = event.target.dataset.synth;
  
  appState.currentSynthIndex = index;
  appState.currentSynthType = synthType;
  
  // UIの更新
  const soundButtons = document.querySelectorAll('.sound-button');
  for (const button of soundButtons) {
    button.classList.remove('selected');
    if (parseInt(button.dataset.index) === index) {
      button.classList.add('selected');
    }
  }
}

// 音色エディタ関連の関数
function openSoundEditor() {
  // 一時的な設定として現在の音色設定をコピー
  appState.tempSounds = JSON.parse(JSON.stringify(customSounds));
  appState.editingSound = true;
  
  // エディタの内容を生成
  updateSoundEditor();
  
  // モーダルを表示
  document.getElementById('sound-editor-modal').classList.add('active');
}

function closeSoundEditor() {
  document.getElementById('sound-editor-modal').classList.remove('active');
  appState.editingSound = false;
}

function updateSoundEditor() {
  const editorContent = document.getElementById('sound-editor-content');
  editorContent.innerHTML = '';
  
  appState.tempSounds.forEach((sound, index) => {
    const row = document.createElement('div');
    row.className = 'sound-editor-row';
    
    // 色のプレビュー
    const preview = document.createElement('div');
    preview.className = 'sound-preview';
    preview.style.backgroundColor = sound.color;
    row.appendChild(preview);
    
    // コントロール部分
    const controls = document.createElement('div');
    controls.className = 'sound-editor-controls';
    
    // 名前入力
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = sound.name;
    nameInput.placeholder = '音色名';
    nameInput.style.width = '100%';
    nameInput.style.marginBottom = '5px';
    nameInput.style.padding = '5px';
    nameInput.style.backgroundColor = '#333';
    nameInput.style.color = 'white';
    nameInput.style.border = '1px solid #555';
    nameInput.style.borderRadius = '4px';
    nameInput.dataset.index = index;
    nameInput.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index);
      appState.tempSounds[idx].name = e.target.value;
    });
    controls.appendChild(nameInput);
    
    // シンセタイプ選択
    const synthSelect = document.createElement('select');
    synthSelect.className = 'synth-selector';
    AVAILABLE_SYNTHS.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.text = type.charAt(0).toUpperCase() + type.slice(1);
      option.selected = type === sound.synthType;
      synthSelect.appendChild(option);
    });
    synthSelect.dataset.index = index;
    synthSelect.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      appState.tempSounds[idx].synthType = e.target.value;
    });
    controls.appendChild(synthSelect);
    
    // 色選択
    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker';
    
    AVAILABLE_COLORS.forEach((color, colorIndex) => {
      const colorOption = document.createElement('div');
      colorOption.className = 'color-option';
      colorOption.style.backgroundColor = color;
      if (colorIndex === sound.colorIndex) {
        colorOption.classList.add('selected');
      }
      colorOption.dataset.index = index;
      colorOption.dataset.colorIndex = colorIndex;
      colorOption.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        const colorIdx = parseInt(e.target.dataset.colorIndex);
        appState.tempSounds[idx].colorIndex = colorIdx;
        appState.tempSounds[idx].color = AVAILABLE_COLORS[colorIdx];
        
        // 選択状態を更新
        const siblings = e.target.parentNode.querySelectorAll('.color-option');
        siblings.forEach(sib => sib.classList.remove('selected'));
        e.target.classList.add('selected');
        
        // プレビューを更新
        const rowElem = e.target.closest('.sound-editor-row');
        const preview = rowElem.querySelector('.sound-preview');
        preview.style.backgroundColor = AVAILABLE_COLORS[colorIdx];
      });
      colorPicker.appendChild(colorOption);
    });
    
    controls.appendChild(colorPicker);
    
    row.appendChild(controls);
    editorContent.appendChild(row);
  });
}

function saveSoundSettings() {
  // 一時的な設定を保存
  customSounds = JSON.parse(JSON.stringify(appState.tempSounds));
  
  // 現在選択中のシンセタイプを更新
  if (appState.currentSynthIndex < customSounds.length) {
    appState.currentSynthType = customSounds[appState.currentSynthIndex].synthType;
  }
  
  // 色を更新
  setupColors();
  
  // パレットを更新
  updateSoundPalette();
  
  // モーダルを閉じる
  closeSoundEditor();
}

function resetSoundSettings() {
  // デフォルト設定に戻す
  customSounds = DEFAULT_SYNTHS.map((type, i) => ({
    id: i,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    synthType: type,
    colorIndex: i % AVAILABLE_COLORS.length,
    color: AVAILABLE_COLORS[i % AVAILABLE_COLORS.length]
  }));
  
  // 一時設定も更新
  appState.tempSounds = JSON.parse(JSON.stringify(customSounds));
  
  // エディタ内容を更新
  updateSoundEditor();
  
  // 現在選択中の音色をリセット
  appState.currentSynthIndex = 0;
  appState.currentSynthType = customSounds[0].synthType;
}

function updateBPM(event) {
  appState.bpm = parseInt(event.target.value);
  Tone.Transport.bpm.value = appState.bpm;
  document.getElementById('bpm-value').textContent = appState.bpm;
  
  // メトロノームが有効な場合、スケジュールを更新
  if (appState.metronome.active && Tone.Transport.state === 'started') {
    startMetronome(); // 既存のスケジュールをクリアして新しくスケジュールする
  }
}

function updateReverb(event) {
  appState.reverbAmount = parseInt(event.target.value) / 100;
  effects.reverb.wet.value = appState.reverbAmount;
  document.getElementById('reverb-value').textContent = `${event.target.value}%`;
}

function updateDelay(event) {
  appState.delayAmount = parseInt(event.target.value) / 100;
  effects.delay.wet.value = appState.delayAmount;
  document.getElementById('delay-value').textContent = `${event.target.value}%`;
}

function updateVisualIntensity(e) {
  appState.visualIntensity = parseInt(e.target.value) / 100;
  document.getElementById('visual-value').textContent = e.target.value + '%';
}

// 追加関数
function updateLoopLength(event) {
  appState.loopLength = parseInt(event.target.value);
  document.getElementById('loop-length-value').textContent = appState.loopLength;
  
  // アクティブなループを更新
  for (let i = 0; i < appState.loops.length; i++) {
    if (appState.loops[i].active && loopSequences[i]) {
      const loopDuration = appState.loopLength * 60 / appState.bpm;
      loopSequences[i].loopEnd = loopDuration;
    }
  }
}

function setRecordingMode(mode) {
  appState.recordingMode = mode;
  
  // UIの更新
  document.getElementById('mode-auto').classList.toggle('selected', mode === 'auto');
  document.getElementById('mode-manual').classList.toggle('selected', mode === 'manual');
}

function toggleCompactMode() {
  appState.compactMode = !appState.compactMode;
  const appContainer = document.getElementById('app-container');
  const toggleButton = document.getElementById('toggle-panel');
  
  // コンパクトモードの切り替え
  appContainer.classList.toggle('compact-mode', appState.compactMode);
  
  // ボタンテキストの更新
  if (appState.compactMode) {
    toggleButton.textContent = 'パネル展開';
    toggleButton.style.backgroundColor = 'rgba(76, 175, 80, 0.7)'; // 緑色
  } else {
    toggleButton.textContent = 'パネル折りたたみ';
    toggleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 元の色
  }
  
  // キャンバスサイズの再計算
  windowResized();
}

// ヘルプの表示/非表示を切り替える
function toggleHelp() {
  const instructions = document.getElementById('instructions');
  const helpToggle = document.getElementById('help-toggle');
  
  // クラスの切り替え
  instructions.classList.toggle('hidden');
  
  // ボタンテキストの更新
  if (instructions.classList.contains('hidden')) {
    helpToggle.textContent = 'ヘルプ表示';
    helpToggle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  } else {
    helpToggle.textContent = 'ヘルプ非表示';
    helpToggle.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
  }
}

// ウィンドウサイズが変更されたときにキャンバスをリサイズ
function windowResized() {
  const canvasContainer = document.getElementById('canvas-container');
  resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
}

// パーティクルクラス
class Particle {
  constructor(x, y, particleColor) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.size = random(5, 20);
    this.color = particleColor || color(random(360), 80, 100, 0.7);
    this.life = 255;
  }
  
  update(audioLevel) {
    // 音量に応じて加速度を変更
    this.acc = p5.Vector.random2D().mult(audioLevel * 0.1);
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.life -= 2;
  }
  
  display() {
    noStroke();
    fill(this.color, this.life / 255);
    ellipse(this.pos.x, this.pos.y, this.size * (currentLevel * 5 + 1));
  }
  
  isDead() {
    return this.life <= 0;
  }
}

// ループパッドの右クリックメニューを作成
function createLoopPadMenu() {
  // 既存のメニューがあれば削除
  const existingMenu = document.getElementById('loop-pad-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // メニュー要素を作成
  const menu = document.createElement('div');
  menu.id = 'loop-pad-menu';
  menu.className = 'loop-pad-menu';
  
  // メニュー項目の追加
  const clearItem = document.createElement('div');
  clearItem.className = 'loop-pad-menu-item';
  clearItem.textContent = 'クリア';
  clearItem.id = 'clear-loop';
  clearItem.addEventListener('click', () => {
    const loopIndex = parseInt(menu.dataset.loopIndex);
    clearLoop(loopIndex);
    hideLoopPadMenu();
  });
  menu.appendChild(clearItem);
  
  // ドキュメントにメニューを追加
  document.body.appendChild(menu);
}

// ループパッドの右クリックメニューを表示
function showLoopPadMenu(event) {
  // デフォルトの右クリックメニューを表示しない
  event.preventDefault();
  
  // 現在のループインデックスを取得
  const loopIndex = parseInt(event.target.dataset.index);
  const loop = appState.loops[loopIndex];
  
  // 内容がない場合はメニューを表示しない
  if (!loop.hasContent) {
    return;
  }
  
  // メニュー要素を取得
  const menu = document.getElementById('loop-pad-menu');
  
  // ループインデックスをメニューに設定
  menu.dataset.loopIndex = loopIndex;
  
  // メニューの位置を設定
  menu.style.left = `${event.pageX}px`;
  menu.style.top = `${event.pageY}px`;
  
  // メニューを表示
  menu.style.display = 'block';
}

// ループパッドの右クリックメニューを非表示
function hideLoopPadMenu() {
  const menu = document.getElementById('loop-pad-menu');
  if (menu) {
    menu.style.display = 'none';
  }
}

// 特定のループをクリア
function clearLoop(loopIndex) {
  // ループの再生を停止
  if (loopSequences[loopIndex]) {
    loopSequences[loopIndex].stop();
    loopSequences[loopIndex].dispose();
    loopSequences[loopIndex] = null;
  }
  
  // ループの状態をリセット
  appState.loops[loopIndex].active = false;
  appState.loops[loopIndex].recording = false;
  appState.loops[loopIndex].events = [];
  appState.loops[loopIndex].hasContent = false;
  appState.loops[loopIndex].pattern = null;
  
  // 録音中のループがこのループだった場合、録音状態もリセット
  if (appState.recordingLoop === loopIndex) {
    appState.recordingLoop = null;
  }
  
  // UIの更新
  updateLoopUI();
}

// サンプルパターンを自動生成
function generateSample() {
  // アプリケーションが開始されていない場合は何もしない
  if (!appState.started) {
    alert('まず「スタート」ボタンをクリックしてアプリケーションを開始してください。');
    return;
  }
  
  // 現在利用可能なループパッドを探す（空きがなければ警告）
  let availableLoopIndex = -1;
  for (let i = 0; i < appState.loops.length; i++) {
    if (!appState.loops[i].hasContent) {
      availableLoopIndex = i;
      break;
    }
  }
  
  if (availableLoopIndex === -1) {
    // 空きがない場合、クリアするかどうか確認
    if (confirm('空きループがありません。ランダムなループをクリアして新しいパターンを生成しますか？')) {
      // ランダムなループをクリア
      const randomLoopIndex = Math.floor(Math.random() * appState.loops.length);
      clearLoop(randomLoopIndex);
      availableLoopIndex = randomLoopIndex;
    } else {
      return; // キャンセルした場合は何もしない
    }
  }
  
  // 音色をランダムに選択（現在選択されている音色の可能性も高くする）
  let selectedSynthIndex;
  if (Math.random() < 0.4) {
    // 40%の確率で現在選択されている音色を使用
    selectedSynthIndex = appState.currentSynthIndex;
  } else {
    // それ以外は完全にランダム
    selectedSynthIndex = Math.floor(Math.random() * customSounds.length);
  }
  
  const selectedSynthType = customSounds[selectedSynthIndex].synthType;
  
  // シンセタイプに最適なリズムパターンを選択
  let patternTypes;
  if (SYNTH_TYPE_PATTERNS[selectedSynthType]) {
    // シンセタイプに合わせたパターン
    patternTypes = SYNTH_TYPE_PATTERNS[selectedSynthType];
  } else {
    // デフォルトの全パターン
    patternTypes = Object.keys(RHYTHM_PATTERNS);
  }
  
  // パターンタイプをランダムに選択（シンセタイプに最適なもの）
  const selectedPatternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
  const selectedPattern = RHYTHM_PATTERNS[selectedPatternType];
  
  // イベントの生成
  const events = [];
  const loopDuration = appState.loopLength * 60 / appState.bpm;
  
  // コード進行を選択（ランダムに）
  const progressionTypes = Object.keys(CHORD_PROGRESSIONS);
  const selectedProgression = CHORD_PROGRESSIONS[progressionTypes[Math.floor(Math.random() * progressionTypes.length)]];
  
  // スケールを取得
  const currentScale = SCALES[appState.currentScale];
  
  // パターン回数（小節数に応じて繰り返す）
  const patternRepeat = Math.max(1, Math.min(4, appState.loopLength));
  
  // コード進行を適用するかどうか（メロディックなシンセ向け）
  const applyProgression = ['sine', 'triangle', 'pluck', 'fm', 'am'].includes(selectedSynthType);
  
  for (let rep = 0; rep < patternRepeat; rep++) {
    // コード進行からコード番号を取得
    const chordIndex = selectedProgression[rep % selectedProgression.length];
    
    for (const beatPosition of selectedPattern) {
      // 各小節ごとのオフセットを計算
      const timeOffset = rep * (loopDuration / patternRepeat);
      const time = timeOffset + beatPosition * (loopDuration / patternRepeat);
      
      // Y座標（音程）をコード進行に基づいて生成
      let y;
      if (applyProgression) {
        // コード進行に基づく音程選択
        const noteIndex = (chordIndex + Math.floor(Math.random() * 3) * 2) % currentScale.length;
        y = 0.2 + (noteIndex / currentScale.length) * 0.6;
      } else {
        // 一般的なパターン（打楽器など）
        y = rep % 2 === 0 
          ? 0.2 + (beatPosition * 0.5) % 0.8 // 前半のパターン
          : 0.8 - (beatPosition * 0.5) % 0.8; // 後半は反転パターン
      }
      
      // X座標（音量）- 強拍を強調するロジック
      let x;
      if (beatPosition === 0 || beatPosition === 0.5) {
        // 強拍はより大きな音量
        x = 0.6 + Math.random() * 0.3;
      } else {
        // 弱拍は弱めに
        x = 0.3 + Math.random() * 0.4;
      }
      
      // BPMに合わせた音の特性調整
      if (appState.bpm > 140) {
        // 速いテンポでは短めの音にする
        x = Math.min(x, 0.85); // 音量を控えめに
      } else if (appState.bpm < 80) {
        // 遅いテンポでは音にサステインを加える
        x = Math.max(x, 0.4); // 最低音量を上げる
      }
      
      // イベントを追加
      events.push({
        time: time,
        x: x,
        y: y,
        synthType: selectedSynthType
      });
    }
  }
  
  // パターンに応じたランダム性を追加
  const randomChance = selectedPattern.length < 4 ? 0.4 : 0.2; // スパースなパターンほど追加音を入れやすく
  
  if (Math.random() < randomChance) {
    const extraCount = 1 + Math.floor(Math.random() * 2); // 1-2個の追加音
    
    for (let i = 0; i < extraCount; i++) {
      // 追加音符を生成
      const extraNote = {
        time: Math.random() * loopDuration,
        x: 0.3 + Math.random() * 0.4,
        y: Math.random(),
        synthType: selectedSynthType
      };
      events.push(extraNote);
    }
  }
  
  // ドラム系の場合は位置を特定のエリアに固定
  if (['kick', 'snare', 'hihat'].includes(selectedSynthType)) {
    events.forEach(event => {
      if (selectedSynthType === 'kick') {
        event.y = 0.2 + Math.random() * 0.2; // 低めの位置
      } else if (selectedSynthType === 'snare') {
        event.y = 0.4 + Math.random() * 0.2; // 中間の位置
      } else if (selectedSynthType === 'hihat') {
        event.y = 0.7 + Math.random() * 0.25; // 高めの位置
      }
    });
  }
  
  // ループの状態を設定
  appState.loops[availableLoopIndex].events = events;
  appState.loops[availableLoopIndex].hasContent = true;
  
  // 生成したループを開始
  startLoop(availableLoopIndex);
  
  // UIの更新
  updateLoopUI();
  
  // 生成確認メッセージ
  const padElement = document.querySelector(`.loop-pad[data-index="${availableLoopIndex}"]`);
  if (padElement) {
    padElement.classList.add('generated');
    setTimeout(() => {
      padElement.classList.remove('generated');
    }, 1000);
  }
}

// メトロノーム関連の関数を追加
function setupMetronomeSounds() {
  // クリック音 - シンプルなメトロノーム音
  synths.metronomeClick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 5,
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0.2
    }
  }).connect(effects.master);
  
  // キック音 - 低い音のドラム
  synths.kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0,
      release: 0.4
    }
  }).connect(effects.master);
  
  // スネア音 - 中音域のドラム
  synths.snare = new Tone.NoiseSynth({
    noise: {
      type: 'white'
    },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0.2
    }
  }).connect(effects.master);
  
  // ハイハット音 - 高音域の金属音
  synths.hihat = new Tone.MetalSynth({
    frequency: 800,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      release: 0.01
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).connect(effects.master);
}

// ビートインジケータの作成
function createBeatIndicator() {
  const container = document.getElementById('beat-indicator');
  if (!container) return;  // 要素が存在しない場合は終了
  
  container.innerHTML = '';
  
  // 4拍分のドットを作成
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement('div');
    dot.className = 'beat-dot';
    if (i === 0) {
      dot.classList.add('accent'); // 1拍目はアクセント
    }
    container.appendChild(dot);
  }
  
  // 初期ビートインジケーターの表示状態を設定
  updateBeatIndicatorVisibility();
}

// ビートインジケータの更新
function updateBeatIndicator(currentBeat) {
  const indicator = document.getElementById('beat-indicator');
  if (!indicator) {
    console.log('ビートインジケーターが見つかりません');
    return; // 要素が存在しない場合は処理しない
  }
  
  const dots = indicator.querySelectorAll('.beat-dot');
  if (dots.length === 0) {
    console.log('ビートドットが見つかりません');
    return; // ドットが存在しない場合は処理しない
  }
  
  // アクティブなビートを視覚的に示す
  dots.forEach((dot, index) => {
    if (index === currentBeat) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
  
  // デバッグ情報をコンソールに出力
  console.log(`ビート更新: ${currentBeat}, ドット数: ${dots.length}`);
}

// メトロノームの表示/非表示
function updateBeatIndicatorVisibility() {
  const indicator = document.getElementById('beat-indicator');
  if (!indicator) return; // 要素が存在しない場合は処理しない
  
  indicator.style.display = appState.metronome.active ? 'flex' : 'none';
}

// メトロノームのトグル
function toggleMetronome() {
  appState.metronome.active = !appState.metronome.active;
  
  // UI更新（ボタン表示とビートインジケーター表示）
  updateMetronomeUI();
  
  // メトロノームをオン/オフに切り替え
  if (appState.metronome.active) {
    console.log('メトロノームをオンにしました。Transport状態:', Tone.Transport.state);
    // BPMに応じたコールバックをスケジュール
    if (Tone.Transport.state === 'started') {
      startMetronome();
    }
  } else {
    console.log('メトロノームをオフにしました');
    // イベントをクリア
    Tone.Transport.clear(appState.metronome.eventId);
    appState.metronome.currentBeat = -1;
    updateBeatIndicator(-1);
  }
}

// メトロノームを開始
function startMetronome() {
  console.log('メトロノーム開始処理を実行します');
  
  // 既存のスケジュールをクリア
  Tone.Transport.clear(appState.metronome.eventId);
  
  // ビートインジケーターの表示を確認
  updateBeatIndicatorVisibility();
  
  // 初期状態をリセット
  appState.metronome.currentBeat = -1;
  updateBeatIndicator(-1);
  
  // 新しいコールバックをスケジュール
  appState.metronome.eventId = Tone.Transport.scheduleRepeat((time) => {
    // 現在のビート位置を更新
    appState.metronome.currentBeat = (appState.metronome.currentBeat + 1) % appState.metronome.beatsPerBar;
    const beat = appState.metronome.currentBeat;
    
    console.log(`メトロノームビート: ${beat}, 時間: ${time}`);
    
    // ビジュアルの更新をスケジュール - より確実に実行されるよう修正
    Tone.Draw.schedule(() => {
      console.log(`Draw scheduled for beat: ${beat}`);
      updateBeatIndicator(beat);
    }, time);
    
    // パターンに応じて音を鳴らす
    const volume = appState.metronome.volume;
    
    switch (appState.metronome.pattern) {
      case 'click':
        // シンプルなクリック音: 1拍目は高い音、他は低い音
        if (beat === 0) {
          synths.metronomeClick.triggerAttackRelease('C3', '32n', time, volume * 0.8);
        } else {
          synths.metronomeClick.triggerAttackRelease('C2', '32n', time, volume * 0.5);
        }
        break;
        
      case 'fourOnFloor':
        // 4つ打ち: すべての拍でキック
        synths.kick.triggerAttackRelease('C1', '8n', time, volume * 0.8);
        // 4分音符の裏でハイハット
        if (beat % 2 === 0) {
          synths.hihat.triggerAttackRelease('16n', time + Tone.Time('8n').toSeconds() / 2, volume * 0.3);
        }
        break;
        
      case 'backbeat':
        // バックビート: 1,3拍目でキック、2,4拍目でスネア
        if (beat === 0 || beat === 2) {
          synths.kick.triggerAttackRelease('C1', '8n', time, volume * 0.8);
        } else {
          synths.snare.triggerAttackRelease('16n', time, volume * 0.5);
        }
        break;
        
      case 'hihat':
        // ハイハットパターン: 全拍でハイハット、1,3拍目で強め
        if (beat === 0 || beat === 2) {
          synths.hihat.triggerAttackRelease('32n', time, volume * 0.7);
        } else {
          synths.hihat.triggerAttackRelease('32n', time, volume * 0.5);
        }
        // 1拍目でキック
        if (beat === 0) {
          synths.kick.triggerAttackRelease('C1', '8n', time, volume * 0.7);
        }
        // 3拍目でスネア
        if (beat === 2) {
          synths.snare.triggerAttackRelease('16n', time, volume * 0.4);
        }
        break;
    }
  }, '4n'); // 4分音符ごとに実行
}

// クオンタイズ関連の関数 //

// イベントの時間をクオンタイズする関数
function quantizeEvent(time) {
  const loopDuration = appState.loopLength * 60 / appState.bpm;
  const beatsPerBar = 4; // 4/4拍子を想定
  const beatsTotal = appState.loopLength * beatsPerBar;
  
  // グリッド値に基づいて各拍のディビジョン（分割）を決定
  let division = 1; // 4分音符（1拍）
  switch (appState.quantize.grid) {
    case '4n': division = 1; break; // 4分音符 = 1拍
    case '8n': division = 2; break; // 8分音符 = 1/2拍
    case '16n': division = 4; break; // 16分音符 = 1/4拍
    case '8t': division = 3; break; // 8分3連符 = 1/3拍
  }
  
  // グリッド単位の時間を計算（1拍の長さ / 分割数）
  const beatDuration = loopDuration / beatsTotal;
  const gridDuration = beatDuration / division;
  
  // 最も近いグリッド位置を計算
  const gridsTotal = beatsTotal * division;
  const normalizedTime = time / loopDuration; // 0-1に正規化
  const gridIndex = Math.round(normalizedTime * gridsTotal);
  const quantizedTime = (gridIndex / gridsTotal) * loopDuration;
  
  // 強度に基づいて補正（0%=元の位置、100%=完全にグリッドに合わせる）
  const strength = appState.quantize.strength / 100;
  return time + (quantizedTime - time) * strength;
}

// 選択したループにクオンタイズを適用する関数
function applyQuantizeToLoop() {
  if (appState.selectedLoop === null) {
    alert('ループを選択してください');
    return;
  }
  
  const loopIndex = appState.selectedLoop;
  const loop = appState.loops[loopIndex];
  
  if (!loop.hasContent) {
    alert('選択したループは空です');
    return;
  }
  
  // 各イベントに量子化を適用
  loop.events = loop.events.map(event => {
    const quantizedTime = quantizeEvent(event.time);
    return { ...event, time: quantizedTime };
  });
  
  // ループが再生中ならパターンを更新
  if (loop.active && loop.pattern) {
    stopLoop(loopIndex);
    startLoop(loopIndex);
  }
  
  alert('クオンタイズを適用しました');
}

// グリッド線の描画
function drawGridLines() {
  const loopDuration = appState.loopLength * 60 / appState.bpm;
  const beatsPerBar = 4; // 4/4拍子を想定
  const beatsTotal = appState.loopLength * beatsPerBar;
  
  // グリッド値に基づいて各拍のディビジョン（分割）を決定
  let division = 1; // 4分音符（1拍）
  switch (appState.quantize.grid) {
    case '4n': division = 1; break; // 4分音符 = 1拍
    case '8n': division = 2; break; // 8分音符 = 1/2拍
    case '16n': division = 4; break; // 16分音符 = 1/4拍
    case '8t': division = 3; break; // 8分3連符 = 1/3拍
  }
  
  // 全グリッド数
  const gridsTotal = beatsTotal * division;
  
  // 小節線（太線）、拍線（中線）、細分線（細線）
  for (let i = 0; i <= gridsTotal; i++) {
    const position = i / gridsTotal;
    const x = position * width;
    
    // 線の種類に応じて描画設定を変更
    if (i % (division * beatsPerBar) === 0) {
      // 小節線
      stroke(255, 0.5);
      strokeWeight(3);
    } else if (i % division === 0) {
      // 拍線
      stroke(255, 0.3);
      strokeWeight(2);
    } else {
      // 細分線
      stroke(255, 0.1);
      strokeWeight(1);
    }
    
    line(x, 0, x, height);
  }
}

// クオンタイズ機能のトグル
function toggleQuantize() {
  appState.quantize.enabled = !appState.quantize.enabled;
  
  // UIの更新
  const toggle = document.getElementById('quantize-toggle');
  toggle.textContent = appState.quantize.enabled ? 'オン' : 'オフ';
  toggle.style.backgroundColor = appState.quantize.enabled ? '#4CAF50' : '#555';
  
  // 設定パネルの表示/非表示
  document.getElementById('quantize-settings').style.display = 
    appState.quantize.enabled ? 'block' : 'none';
  
  // 後から適用ボタンの表示/非表示を更新
  updateApplyButtonVisibility();
}

// グリッド設定の変更
function setQuantizeGrid(grid) {
  appState.quantize.grid = grid;
  
  // UIの更新
  const buttons = ['quantize-grid-4n', 'quantize-grid-8n', 'quantize-grid-16n', 'quantize-grid-8t'];
  buttons.forEach(id => {
    document.getElementById(id).classList.remove('selected');
  });
  
  document.getElementById(`quantize-grid-${grid}`).classList.add('selected');
}

// 強度の更新
function updateQuantizeStrength(event) {
  appState.quantize.strength = event.target.value;
  document.getElementById('quantize-strength-value').textContent = `${appState.quantize.strength}%`;
}

// 適用タイミングの設定
function setQuantizeApplyTiming(onRecord) {
  appState.quantize.applyOnRecord = onRecord;
  
  // UIの更新
  document.getElementById('apply-on-record').classList.toggle('selected', onRecord);
  document.getElementById('apply-after').classList.toggle('selected', !onRecord);
  
  // 後から適用ボタンの表示/非表示を更新
  updateApplyButtonVisibility();
}

// グリッド表示のトグル
function toggleGridDisplay(event) {
  appState.quantize.showGrid = event.target.checked;
}

// 後から適用ボタンの表示/非表示を更新
function updateApplyButtonVisibility() {
  document.getElementById('apply-buttons').style.display = 
    (appState.quantize.active && !appState.quantize.applyOnRecord) ? 'block' : 'none';
}

// ループを選択する関数
function selectLoop(loopIndex) {
  // 現在選択されているループをリセット
  if (appState.selectedLoop !== null) {
    const oldSelectedPad = document.querySelector(`.loop-pad[data-index="${appState.selectedLoop}"]`);
    if (oldSelectedPad) {
      oldSelectedPad.classList.remove('selected');
    }
  }
  
  // 同じループを再度クリックした場合は選択解除
  if (appState.selectedLoop === loopIndex) {
    appState.selectedLoop = null;
    updateApplyButtonVisibility();
    return;
  }
  
  // 新しいループを選択
  appState.selectedLoop = loopIndex;
  const selectedPad = document.querySelector(`.loop-pad[data-index="${loopIndex}"]`);
  if (selectedPad) {
    selectedPad.classList.add('selected');
  }
  
  // 適用ボタンの表示状態を更新
  updateApplyButtonVisibility();
}

// ========== 設定のインポート/エクスポート機能 ========== //

// エクスポートパネルの表示
function showExportPanel() {
  // インポートパネルを非表示
  document.getElementById('import-form').style.display = 'none';
  
  // 現在の設定をJSONに変換
  const settings = exportSettings();
  document.getElementById('export-json').value = JSON.stringify(settings, null, 2);
  
  // エクスポートパネルを表示
  document.getElementById('export-result').style.display = 'block';
}

// インポートパネルの表示
function showImportPanel() {
  // エクスポートパネルを非表示
  document.getElementById('export-result').style.display = 'none';
  
  // インポートパネルを表示
  document.getElementById('import-form').style.display = 'block';
  document.getElementById('import-json').value = '';
}

// エクスポート用の設定オブジェクトを作成
function exportSettings() {
  // 現在の設定をJSONとして出力
  const exportData = {
    version: "1.0",
    bpm: appState.bpm,
    loopLength: appState.loopLength,
    recordingMode: appState.recordingMode,
    loops: appState.loops.map(loop => ({
      hasContent: loop.hasContent,
      events: loop.hasContent ? loop.events : [],
      color: loop.color
    })),
    sounds: customSounds,
    effects: {
      reverb: parseInt(document.getElementById('reverb-slider').value),
      delay: parseInt(document.getElementById('delay-slider').value),
      visualIntensity: parseInt(document.getElementById('visual-slider').value)
    },
    metronome: {
      active: appState.metronome.active,
      pattern: appState.metronome.pattern,
      volume: appState.metronome.volume
    },
    quantize: {
      active: appState.quantize.active,
      grid: appState.quantize.grid,
      strength: appState.quantize.strength,
      applyTime: appState.quantize.applyOnRecord,
      showGrid: appState.quantize.showGrid
    },
    scale: appState.currentScale
  };
  
  return JSON.stringify(exportData, null, 2);
}

function importSettings(jsonString) {
  try {
    const settings = JSON.parse(jsonString);
    
    // バージョンチェック
    if (!settings.version) {
      alert('不明な形式のデータです。最新のフォーマットではありません。');
      return false;
    }
    
    // 基本設定をインポート
    if (settings.bpm) {
      appState.bpm = settings.bpm;
      document.getElementById('bpm-slider').value = settings.bpm;
      document.getElementById('bpm-value').textContent = settings.bpm;
      Tone.Transport.bpm.value = settings.bpm;
    }
    
    if (settings.loopLength) {
      appState.loopLength = settings.loopLength;
      document.getElementById('loop-length-slider').value = settings.loopLength;
      document.getElementById('loop-length-value').textContent = settings.loopLength;
    }
    
    if (settings.recordingMode) {
      setRecordingMode(settings.recordingMode);
    }
    
    // ループデータをインポート
    if (settings.loops) {
      // 既存のループをクリア
      clearAllLoops();
      
      // 新しいループデータを設定
      settings.loops.forEach((loopData, index) => {
        if (index < appState.loops.length) {
          appState.loops[index].hasContent = loopData.hasContent;
          appState.loops[index].color = loopData.color;
          
          if (loopData.hasContent && loopData.events) {
            appState.loops[index].events = loopData.events;
            startLoop(index);
          }
        }
      });
      
      updateLoopUI();
    }
    
    // サウンドデータをインポート
    if (settings.sounds) {
      customSounds = settings.sounds;
      updateSoundPalette();
    }
    
    // エフェクト設定をインポート
    if (settings.effects) {
      if (settings.effects.reverb !== undefined) {
        appState.reverbAmount = settings.effects.reverb;
        document.getElementById('reverb-slider').value = settings.effects.reverb;
        updateReverb({ target: { value: settings.effects.reverb } });
      }
      
      if (settings.effects.delay !== undefined) {
        appState.delayAmount = settings.effects.delay;
        document.getElementById('delay-slider').value = settings.effects.delay;
        updateDelay({ target: { value: settings.effects.delay } });
      }
      
      if (settings.effects.visualIntensity !== undefined) {
        appState.visualIntensity = settings.effects.visualIntensity;
        document.getElementById('visual-slider').value = settings.effects.visualIntensity;
        document.getElementById('visual-value').textContent = settings.effects.visualIntensity + '%';
      }
    }
    
    // メトロノーム設定をインポート
    if (settings.metronome) {
      if (settings.metronome.active !== undefined) {
        appState.metronome.active = settings.metronome.active;
        updateMetronomeUI();
      }
      
      if (settings.metronome.pattern) {
        appState.metronome.pattern = settings.metronome.pattern;
        updateMetronomePatternUI();
      }
      
      if (settings.metronome.volume !== undefined) {
        appState.metronome.volume = settings.metronome.volume;
        document.getElementById('metronome-volume').value = settings.metronome.volume;
        document.getElementById('metronome-volume-value').textContent = settings.metronome.volume + '%';
      }
    }
    
    // クオンタイズ設定をインポート
    if (settings.quantize) {
      if (settings.quantize.active !== undefined) {
        appState.quantize.active = settings.quantize.active;
        updateQuantizeUI();
      }
      
      if (settings.quantize.grid) {
        appState.quantize.grid = settings.quantize.grid;
        updateQuantizeGridUI();
      }
      
      if (settings.quantize.strength !== undefined) {
        appState.quantize.strength = settings.quantize.strength;
        document.getElementById('quantize-strength').value = settings.quantize.strength;
        document.getElementById('quantize-strength-value').textContent = settings.quantize.strength + '%';
      }
      
      if (settings.quantize.applyTime) {
        appState.quantize.applyOnRecord = settings.quantize.applyTime;
        updateQuantizeApplyTimeUI();
      }
      
      if (settings.quantize.showGrid !== undefined) {
        appState.quantize.showGrid = settings.quantize.showGrid;
        document.getElementById('show-grid').checked = settings.quantize.showGrid;
      }
    }
    
    // スケール設定をインポート
    if (settings.scale) {
      appState.currentScale = settings.scale;
      document.getElementById('scale-selector').value = settings.scale;
      updateScaleInfo();
    }
    
    return true;
  } catch (e) {
    console.error('設定のインポート中にエラーが発生しました:', e);
    alert('設定のインポート中にエラーが発生しました: ' + e.message);
    return false;
  }
}

// JSONをクリップボードにコピー
function copyExportJson() {
  const jsonText = document.getElementById('export-json');
  jsonText.select();
  document.execCommand('copy');
  
  // コピー完了のフィードバック
  const originalText = document.getElementById('copy-json').textContent;
  document.getElementById('copy-json').textContent = 'コピー完了';
  setTimeout(() => {
    document.getElementById('copy-json').textContent = originalText;
  }, 1500);
}

// 設定をJSONファイルとしてダウンロード
function downloadSettings() {
  const jsonString = document.getElementById('export-json').value;
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `synth-visualizer-settings-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

// 設定のインポート
function loadSettings() {
  try {
    const jsonText = document.getElementById('import-json').value;
    if (!jsonText.trim()) {
      alert('JSONデータが入力されていません');
      return;
    }
    
    const settings = JSON.parse(jsonText);
    importSettings(settings);
    
    // 成功メッセージ
    alert('設定を正常にインポートしました');
    document.getElementById('import-form').style.display = 'none';
  } catch (error) {
    alert(`設定のインポートに失敗しました: ${error.message}`);
  }
}

// ファイル選択からのインポート
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const settings = JSON.parse(e.target.result);
      document.getElementById('import-json').value = JSON.stringify(settings, null, 2);
    } catch (error) {
      alert(`ファイルの読み込みに失敗しました: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

// スケールを更新する関数
function updateScale(e) {
  const prevScale = appState.currentScale;
  appState.currentScale = e.target.value;
  console.log(`スケールを ${appState.currentScale} に変更しました`);
  
  // フィードバックを表示
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = `スケールを「${getScaleName(appState.currentScale)}」に変更しました`;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  document.body.appendChild(notification);
  
  // 3秒後に通知を消す
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
  
  // スケール情報の表示を更新
  updateScaleInfo();
  
  // スケールプレビューを更新
  updateScalePreview();
  
  // スケール変更を試聴
  previewScale();
}

// スケール名を取得
function getScaleName(scaleKey) {
  const scaleNames = {
    'major': 'メジャー',
    'minor': 'マイナー',
    'pentatonic': 'ペンタトニック',
    'blues': 'ブルース',
    'dorian': 'ドリアン',
    'lydian': 'リディアン',
    'mixolydian': 'ミクソリディアン',
    'harmonic_minor': 'ハーモニックマイナー',
    'melodic_minor': 'メロディックマイナー',
    'chinese': '中国風五音階',
    'japanese': '日本風民謡音階',
    'whole_tone': '全音音階',
    'diminished': 'ディミニッシュ'
  };
  return scaleNames[scaleKey] || scaleKey;
}

// スケール情報の表示を更新
function updateScaleInfo() {
  const scaleInfo = document.querySelector('.scale-info');
  let description = '';
  
  switch (appState.currentScale) {
    case 'major':
      description = '明るく前向きな印象を与える基本的な長調のスケール。';
      break;
    case 'minor':
      description = '暗く哀愁のある印象を与える基本的な短調のスケール。';
      break;
    case 'pentatonic':
      description = '5音階で構成され、東洋的な響きと調和の取れた音階。';
      break;
    case 'blues':
      description = 'ブルースやロックで使われる表現力豊かなスケール。';
      break;
    case 'dorian':
      description = 'ジャズやフュージョンでよく使われる、やや暗めだが流動的な響き。';
      break;
    case 'lydian':
      description = '浮遊感のある明るい響きで、SF的な雰囲気を作り出します。';
      break;
    case 'mixolydian':
      description = 'ロックやブルースに最適なスケール。少し落ち着いた明るさ。';
      break;
    case 'harmonic_minor':
      description = '独特の異国情緒を持つスケール。中東や東欧の音楽を連想させます。';
      break;
    case 'melodic_minor':
      description = 'ジャズ理論の基礎となるスケール。複雑で洗練された響き。';
      break;
    case 'chinese':
      description = '中国風の5音階。東洋の雰囲気を醸し出します。';
      break;
    case 'japanese':
      description = '日本の民謡を思わせる音階。独特の和風の響き。';
      break;
    case 'whole_tone':
      description = '全音のみで構成された音階。印象派音楽によく使われます。';
      break;
    case 'diminished':
      description = 'ジャズの即興演奏に使われる複雑なスケール。緊張感のある響き。';
      break;
    default:
      description = '選択したスケールの音階を使用して音が生成されます。';
  }
  
  scaleInfo.innerHTML = `
    <p>${description}</p>
    <p>異なるスケールで多様な音楽表現を試してみてください。</p>
    <div class="scale-preview" id="scale-preview" title="クリックして試聴">
      <!-- スケールの音を視覚的に表示 -->
    </div>
  `;
  
  // スケールプレビューを更新
  updateScalePreview();
  
  // スケールプレビューのクリックイベントを追加
  document.getElementById('scale-preview').addEventListener('click', previewScale);
}

// スケールプレビューを更新
function updateScalePreview() {
  const preview = document.getElementById('scale-preview');
  if (!preview) return;
  
  preview.innerHTML = '';
  
  const scaleNotes = SCALES[appState.currentScale];
  scaleNotes.forEach((_, index) => {
    const noteElem = document.createElement('div');
    noteElem.className = 'scale-note';
    noteElem.dataset.index = index;
    preview.appendChild(noteElem);
  });
}

// スケールを試聴
function previewScale() {
  const scaleNotes = SCALES[appState.currentScale];
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  synth.volume.value = -10;
  
  // 各音を順番に鳴らす
  scaleNotes.forEach((note, index) => {
    const noteElem = document.querySelector(`.scale-note[data-index="${index}"]`);
    
    // 100msごとに音を鳴らす（アルペジオ風）
    setTimeout(() => {
      synth.triggerAttackRelease(note, '8n');
      
      // 視覚的なフィードバック
      if (noteElem) {
        noteElem.classList.add('active');
        setTimeout(() => {
          noteElem.classList.remove('active');
        }, 300);
      }
    }, index * 200);
  });
  
  // 使い終わったシンセを破棄（メモリリークを防ぐ）
  setTimeout(() => {
    synth.dispose();
  }, scaleNotes.length * 200 + 1000);
}

// QRコードを生成する関数
function generateQRCode() {
  // エクスポート設定のJSONを取得
  const settingsJson = document.getElementById('export-json').value;
  
  // 設定データが空の場合は処理しない
  if (!settingsJson.trim()) {
    alert('設定データが空です。まずエクスポートを行ってください。');
    return;
  }
  
  // QRコードコンテナを表示
  const qrcodeContainer = document.getElementById('qrcode-container');
  qrcodeContainer.style.display = 'block';
  
  // 既存のQRコードをクリア
  const qrcodeElement = document.getElementById('qrcode');
  qrcodeElement.innerHTML = '';
  
  try {
    // 設定データを一時的にBase64エンコードして短くする
    const compressedData = compressSettings(settingsJson);
    
    // QRコードを生成
    new QRCode(qrcodeElement, {
      text: compressedData,
      width: 180,
      height: 180,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M  // エラー訂正レベル（L, M, Q, H）
    });
    
    // QRコードの生成が完了したら表示を更新
    setTimeout(() => {
      qrcodeElement.style.display = 'block';
    }, 100);
  } catch (error) {
    console.error('QRコードの生成に失敗しました:', error);
    alert('QRコードの生成に失敗しました。データが大きすぎる可能性があります。');
  }
}

// 設定データを圧縮する関数
function compressSettings(settingsJson) {
  try {
    // JSONを最小化（スペースや改行を削除）
    const minifiedJson = JSON.stringify(JSON.parse(settingsJson));
    
    // Base64エンコード
    return btoa(minifiedJson);
  } catch (error) {
    console.error('設定データの圧縮に失敗しました:', error);
    return settingsJson; // エラーの場合はそのまま返す
  }
}

// QRコードを画像としてダウンロードする関数
function downloadQRCode() {
  const qrcodeElement = document.querySelector('#qrcode img');
  
  if (!qrcodeElement) {
    alert('QRコードが生成されていません。');
    return;
  }
  
  // QRコードのキャンバスを作成
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // キャンバスサイズを設定
  canvas.width = qrcodeElement.width + 40;  // 余白を追加
  canvas.height = qrcodeElement.height + 40;
  
  // 背景を白に
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // QRコードを描画
  context.drawImage(qrcodeElement, 20, 20);
  
  // 日時を追加
  const dateStr = new Date().toLocaleDateString('ja-JP');
  context.font = '12px Arial';
  context.fillStyle = '#000000';
  context.textAlign = 'center';
  context.fillText(`音楽ジェネレーティブアート・サンプラー (${dateStr})`, canvas.width / 2, canvas.height - 10);
  
  // 画像としてダウンロード
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `music-art-sampler-qr-${Date.now()}.png`;
  link.click();
}

// Web Share APIを使用して共有する関数
function shareQRCode() {
  const qrcodeElement = document.querySelector('#qrcode img');
  
  if (!qrcodeElement) {
    alert('QRコードが生成されていません。');
    return;
  }
  
  // Canvas要素に描画
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = qrcodeElement.width;
  canvas.height = qrcodeElement.height;
  context.drawImage(qrcodeElement, 0, 0);
  
  // Blob化して共有データを作成
  canvas.toBlob((blob) => {
    const shareData = {
      title: '音楽ジェネレーティブアート・サンプラー設定',
      text: '音楽ジェネレーティブアート・サンプラーの設定データです。QRコードをスキャンしてインポートしてください。',
      files: [new File([blob], 'music-art-sampler-qr.png', { type: 'image/png' })]
    };
    
    // Web Share APIが利用可能かチェック
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => console.log('共有が完了しました'))
        .catch((error) => {
          console.error('共有に失敗しました:', error);
          fallbackShare();
        });
    } else {
      // Web Share APIが使えない場合は代替手段を提供
      fallbackShare();
    }
  }, 'image/png');
}

// Web Share APIが使えない場合の代替共有手段
function fallbackShare() {
  // データURLとして取得
  const qrcodeElement = document.querySelector('#qrcode img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = qrcodeElement.width;
  canvas.height = qrcodeElement.height;
  context.drawImage(qrcodeElement, 0, 0);
  
  const dataUrl = canvas.toDataURL('image/png');
  
  // モーダルで表示
  alert('QRコードを保存または右クリックでコピーして共有してください');
  
  // 新しいウィンドウでQRコードを表示
  const win = window.open();
  win.document.write(`<img src="${dataUrl}" alt="QRコード"><p>このQRコードを保存または右クリックでコピーして共有してください</p>`);
}

// QRコードスキャナー関連の変数
let codeReader;
let videoElement;

// QRコードスキャナーを開始
function startQRScanner() {
  // インポートフォームを非表示にして、スキャナーを表示
  document.getElementById('import-form').style.display = 'none';
  document.getElementById('qrcode-scanner').style.display = 'block';
  
  if (!codeReader) {
    codeReader = new ZXing.BrowserMultiFormatReader();
  }
  
  videoElement = document.getElementById('scanner-video');
  
  // カメラへのアクセスを要求
  codeReader.decodeFromVideoDevice(
    undefined,  // デフォルトのカメラを使用
    videoElement,
    (result, error) => {
      if (result) {
        // QRコードが検出された
        const qrCodeData = result.getText();
        console.log('QRコードが検出されました:', qrCodeData);
        
        try {
          // Base64デコード
          const decodedData = atob(qrCodeData);
          
          // JSONとしてパース
          const settingsData = JSON.parse(decodedData);
          
          // 設定を適用
          if (importSettings(JSON.stringify(settingsData, null, 2))) {
            // 成功したらスキャナーを停止
            stopQRScanner();
            alert('QRコードから設定を正常にインポートしました。');
          }
        } catch (e) {
          console.error('QRコードからの設定インポートに失敗しました:', e);
          alert('QRコードからの設定インポートに失敗しました。正しいQRコードであることを確認してください。');
        }
      }
      
      if (error && !(error instanceof ZXing.NotFoundException)) {
        console.error('QRコードスキャン中にエラーが発生しました:', error);
      }
    }
  ).catch(error => {
    console.error('カメラアクセスエラー:', error);
    alert('カメラへのアクセスができませんでした。ブラウザの設定でカメラへのアクセスを許可してください。');
    document.getElementById('qrcode-scanner').style.display = 'none';
    document.getElementById('import-form').style.display = 'block';
  });
}

// QRコードスキャナーを停止
function stopQRScanner() {
  if (codeReader) {
    codeReader.reset();
    
    // UIの表示状態を更新
    document.getElementById('qrcode-scanner').style.display = 'none';
    document.getElementById('import-form').style.display = 'block';
  }
}

// キーボードショートカットハンドラー
function handleKeyboardShortcut(e) {
  // 入力フィールドやテキストエリアでのショートカットは無効化（通常の入力を優先）
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }
  
  // 特定のキー操作のみを処理
  switch (e.key) {
    case ' ': // スペース - スタート/ストップの切り替え
      if (!appState.started) {
        document.getElementById('start').click();
      } else {
        // すでに開始している場合はスタート/ストップを切り替え
        document.getElementById('start').click();
      }
      e.preventDefault(); // ページスクロール防止
      break;
      
    case 'Escape': // ESC - モーダルを閉じる
      const soundEditorModal = document.getElementById('sound-editor-modal');
      if (soundEditorModal && soundEditorModal.style.display === 'flex') {
        document.getElementById('modal-close').click();
      }
      if (document.getElementById('qrcode-scanner').style.display === 'block') {
        stopQRScanner();
      }
      break;
      
    case 'c': // C - 全てクリア
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+C は通常のコピー操作を許可
        return;
      }
      if (confirm('全てのループをクリアしますか？')) {
        clearAllLoops();
      }
      break;
      
    case 'g': // G - パターン自動生成
      generateSample();
      break;
      
    case 'm': // M - メトロノーム切り替え
      document.getElementById('metronome-toggle').click();
      break;
      
    case 'h': // H - ヘルプ表示切り替え
      toggleHelp();
      break;
      
    case 'q': // Q - クオンタイズ切り替え
      document.getElementById('quantize-toggle').click();
      break;
      
    case 'e': // E - エクスポート
      document.getElementById('export-settings').click();
      break;
      
    case 'i': // I - インポート
      document.getElementById('import-settings').click();
      break;
      
    case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
      // 数字キー - 対応するループパッドを選択
      const index = parseInt(e.key) - 1;
      if (index < appState.loops.length) {
        selectLoop(index);
        const pad = document.querySelector(`.loop-pad[data-index="${index}"]`);
        if (pad) {
          pad.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      break;
      
    case 'ArrowUp': // 上矢印 - BPMを上げる
      if (appState.bpm < 180) {
        appState.bpm += 1;
        document.getElementById('bpm-slider').value = appState.bpm;
        document.getElementById('bpm-value').textContent = appState.bpm;
        Tone.Transport.bpm.value = appState.bpm;
      }
      e.preventDefault(); // ページスクロール防止
      break;
      
    case 'ArrowDown': // 下矢印 - BPMを下げる
      if (appState.bpm > 60) {
        appState.bpm -= 1;
        document.getElementById('bpm-slider').value = appState.bpm;
        document.getElementById('bpm-value').textContent = appState.bpm;
        Tone.Transport.bpm.value = appState.bpm;
      }
      e.preventDefault(); // ページスクロール防止
      break;
      
    case 'Delete': case 'Backspace': // Delete/Backspace - 選択中のループをクリア
      if (appState.selectedLoop !== null) {
        if (confirm(`ループ ${appState.selectedLoop + 1} をクリアしますか？`)) {
          clearLoop(appState.selectedLoop);
        }
      }
      break;
      
    case 's': // S - 音色エディタを開く
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+S は通常の保存操作を許可
        return;
      }
      document.getElementById('edit-sounds').click();
      break;
  }
}

// メトロノームパターン選択表示の切り替え
function toggleMetronomePatternSelect() {
  const patternSelect = document.getElementById('metronome-pattern-select');
  patternSelect.style.display = patternSelect.style.display === 'none' ? 'block' : 'none';
}

// メトロノームパターンの選択
function selectMetronomePattern(event) {
  const pattern = event.target.dataset.pattern;
  appState.metronome.pattern = pattern;
  
  // 選択状態の更新
  document.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.classList.add('selected');
  
  // パターン選択メニューを閉じる
  document.getElementById('metronome-pattern-select').style.display = 'none';
}

// メトロノーム音量の更新
function updateMetronomeVolume(event) {
  appState.metronome.volume = parseInt(event.target.value) / 100;
  document.getElementById('metronome-volume-value').textContent = `${event.target.value}%`;
}

// 指定されたノートとパターン名でメトロノームを設定
function setupMetronomePattern(pattern) {
  appState.metronome.pattern = pattern;
  
  // 各パターンボタンの選択状態を更新
  document.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.pattern === pattern);
  });
}

// 更新メトロノームUIの関数を追加
function updateMetronomeUI() {
  const button = document.getElementById('metronome-toggle');
  if (!button) return;
  
  if (appState.metronome.active) {
    button.textContent = 'オン';
    button.classList.remove('metronome-off');
    button.classList.add('metronome-on');
  } else {
    button.textContent = 'オフ';
    button.classList.remove('metronome-on');
    button.classList.add('metronome-off');
  }
  
  // ビートインジケーターの表示状態も更新
  updateBeatIndicatorVisibility();
  
  // メトロノームが有効でTransportが実行中なら再スケジュール
  if (appState.metronome.active && Tone.Transport.state === 'started') {
    console.log('UI更新後にメトロノームを再スケジュール');
    // 既存のスケジュールをクリアしてから再開
    Tone.Transport.clear(appState.metronome.eventId);
    startMetronome();
  }
}

// 録音のトグル処理（新規追加）
function toggleRecording() {
  // アプリが開始していない場合は何もしない
  if (!appState.started) {
    alert('先にスタートボタンをクリックして下さい');
    return;
  }
  
  const recordButton = document.getElementById('record-audio');
  
  // 現在録音中かどうかを確認
  if (appState.recordingLoop !== null) {
    // 録音中の場合は停止
    stopRecording();
    recordButton.textContent = '録音開始';
    recordButton.classList.remove('recording');
    console.log('録音を停止しました');
  } else {
    // 録音開始
    // まずは空きループを探す
    let availableLoopIndex = findAvailableLoop();
    if (availableLoopIndex !== -1) {
      startRecording(availableLoopIndex);
      recordButton.textContent = '録音停止';
      recordButton.classList.add('recording');
      console.log(`ループ ${availableLoopIndex} の録音を開始しました`);
    } else {
      alert('すべてのループが使用中です。いずれかをクリアしてから再試行してください。');
    }
  }
}

// 利用可能なループを探す関数
function findAvailableLoop() {
  // まず選択中のループを試す
  if (appState.selectedLoop !== null && !appState.loops[appState.selectedLoop].hasContent) {
    return appState.selectedLoop;
  }
  
  // それ以外の場合は順番に空きを探す
  for (let i = 0; i < appState.loops.length; i++) {
    if (!appState.loops[i].hasContent) {
      return i;
    }
  }
  
  // 空きが見つからなければ -1 を返す
  return -1;
}
