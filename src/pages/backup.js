const finalizeTrial = ({
    response,
    correct,
    rt,
    stimulus,
    emotion_stimulus = emotionAtStimulusRef.current,
    emotion_response = emotionAtResponseRef.current
  }) => {

    const t0 = stimulusTimeRef.current;
    const data = [...motionBufferRef.current];

    const trialData = data.filter(p => p.t >= t0);

    const preNoGo = data.filter(p => p.t >= t0 - 200 && p.t < t0);
    const postNoGo = trialData.filter(p => p.t >= t0 && p.t <= t0 + 500);

    const mit = firstMovementTimeRef.current
      ? firstMovementTimeRef.current - t0
      : null;

    const leakage = preNoGo.length > 0
      ? preNoGo.reduce((s, p) => s + p.v, 0) / preNoGo.length
      : 0;

    let slope = 0;

    if (postNoGo.length > 2) {
      const n = postNoGo.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

      postNoGo.forEach(p => {
        const x = p.t - t0;
        const y = p.v;

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
      });

      slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    const residualMotion = postNoGo.length > 0
      ? postNoGo.reduce((s, p) => s + Math.abs(p.v), 0)
      : 0;

    let hesitationCount = 0;
    let swerveCount = 0;

    for (let i = 2; i < data.length; i++) {

      const prev = data[i - 1];
      const curr = data[i];
      const prevPrev = data[i - 2];

      const acc1 = prev.v - prevPrev.v;
      const acc2 = curr.v - prev.v;

      if (Math.sign(acc1) !== Math.sign(acc2) && Math.abs(acc1) > 0.002) {
        hesitationCount++;
      }

      const flippedX = Math.sign(prev.x - prevPrev.x) !== Math.sign(curr.x - prev.x);
      const flippedY = Math.sign(prev.y - prevPrev.y) !== Math.sign(curr.y - prev.y);

      if (flippedX || flippedY) {
        swerveCount++;
      }
    }

    const valenceStimulus = emotion_stimulus?.valence ?? null;
    const arousalStimulus = emotion_stimulus?.arousal ?? null;
    const valenceResponse = emotion_response?.valence ?? null;
    const arousalResponse = emotion_response?.arousal ?? null;

    const valenceDelta =
      valenceResponse != null && valenceStimulus != null
        ? valenceResponse - valenceStimulus
        : null;

    const arousalDelta =
      arousalResponse != null && arousalStimulus != null
        ? arousalResponse - arousalStimulus
        : null;

    const emotionalReactivity =
      arousalDelta != null ? Math.abs(arousalDelta) : null;

    trialLogRef.current.push({
      session: playerInfo?.sessionId || 0,

      age: playerInfo?.age || '?',

      gender: playerInfo?.gender || '?',
      
      trial_id: trialIdRef.current,

      stimulus_action: stimulus.action,

      response_action: response,

      correct: correct ? 1 : 0,

      rt_ms: rt || 0,

      mit_ms: mit || 0,

      current_level: level,

      motor_leakage: leakage,

      inhibition_slope: slope,

      residual_motion: residualMotion,

      hesitationCount,

      swerveCount,

      valence_stimulus: valenceStimulus,

      arousal_stimulus: arousalStimulus,

      valence_response: valenceResponse,

      arousal_response: arousalResponse,

      valence_delta: valenceDelta,

      arousal_delta: arousalDelta,

      emotional_reactivity: emotionalReactivity,

      timestamp: Date.now()
    });

    const trial = trialLogRef.current[trialLogRef.current.length - 1];

    fetch("/api/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trial)
    });

  };

  const exportCSV = () => {
    const rows = trialLogRef.current;
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]).join(',');
    
    const csv = [
      headers,
      ...rows.map(row =>
        Object.values(row)
          .map(v => {
            if (typeof v === 'string' && v.includes(',')) {
              return `"${v}"`;
            }
            return v !== null && v !== undefined && v !== '' ? v : '';
          })
          .join(',')
      )
    ].join('\n');

    const playerAge = playerInfo?.age || 'unknown';
    const playerGender = playerInfo?.gender || 'unknown';
    const sessionNum = playerInfo?.sessionId || '0';
    
    const filename = `${playerAge}_${playerGender}_s${sessionNum}.csv`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };