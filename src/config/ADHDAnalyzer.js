// ADHDAnalyzer.js
export class ADHDAnalyzer {
  constructor() {
    // Age-normalized benchmarks (for ages 5-8)
    this.benchmarks = {
      reactionTime: {
        normal: { min: 800, max: 2000 }, // milliseconds
        adhd: { min: 1200, max: 4000 }
      },
      accuracy: {
        normal: { min: 0.7, max: 0.95 }, // percentage
        adhd: { min: 0.4, max: 0.8 }
      },
      mousePathLength: {
        normal: { min: 100, max: 500 }, // pixels per task
        adhd: { min: 300, max: 2000 }
      },
      errors: {
        normal: { min: 0, max: 3 }, // per activity
        adhd: { min: 2, max: 10 }
      },
      ruleChangeAdaptation: {
        normal: { time: 2000 }, // milliseconds to adapt
        adhd: { time: 5000 }
      },
      attentionConsistency: {
        normal: { variance: 0.3 }, // lower variance = more consistent
        adhd: { variance: 0.7 }
      }
    };
  }

  // Main analysis function
  analyzeGameData(gameData) {
    const metrics = this.extractMetrics(gameData);
    const adhdIndicators = this.calculateIndicators(metrics);
    const adhdPercentage = this.calculateADHDPercentage(adhdIndicators);
    const riskLevel = this.determineRiskLevel(adhdPercentage);
    
    return {
      metrics,
      adhdIndicators,
      adhdPercentage,
      riskLevel,
      recommendations: this.generateRecommendations(adhdIndicators, riskLevel),
      strengths: this.identifyStrengths(adhdIndicators),
      detailedAnalysis: this.getDetailedAnalysis(adhdIndicators)
    };
  }

  extractMetrics(gameData) {
    const metrics = {
      reactionTimes: [],
      accuracyRate: 0,
      totalErrors: gameData.errors?.length || 0,
      mousePathComplexity: 0,
      ruleChangePerformance: null,
      attentionSpan: 0,
      impulsivityIndex: 0,
      hyperactivityIndex: 0
    };

    // Calculate reaction time metrics
    if (gameData.reactionTimes && gameData.reactionTimes.length > 0) {
      metrics.reactionTimes = gameData.reactionTimes;
      metrics.averageReactionTime = this.calculateAverage(gameData.reactionTimes);
      metrics.reactionTimeVariance = this.calculateVariance(gameData.reactionTimes);
    }

    // Calculate accuracy
    const totalClicks = (gameData.reactionTimes?.length || 0) + (gameData.errors?.length || 0);
    metrics.accuracyRate = totalClicks > 0 
      ? (gameData.reactionTimes?.length || 0) / totalClicks 
      : 0;

    // Calculate mouse movement complexity
    if (gameData.mouseMovements && gameData.mouseMovements.length > 0) {
      metrics.mousePathComplexity = this.calculateMouseComplexity(gameData.mouseMovements);
      metrics.hyperactivityIndex = this.calculateHyperactivityIndex(gameData.mouseMovements);
    }

    // Rule change adaptation
    if (gameData.ruleChangeAdaptation) {
      metrics.ruleChangePerformance = this.analyzeRuleChange(gameData);
    }

    // Impulsivity index (based on errors before successful attempts)
    metrics.impulsivityIndex = this.calculateImpulsivityIndex(gameData.errors);

    // Attention span (based on time consistency)
    metrics.attentionSpan = this.calculateAttentionSpan(gameData.reactionTimes);

    return metrics;
  }

  calculateIndicators(metrics) {
    return {
      inattention: this.calculateInattentionScore(metrics),
      impulsivity: this.calculateImpulsivityScore(metrics),
      hyperactivity: this.calculateHyperactivityScore(metrics),
      workingMemory: this.calculateWorkingMemoryScore(metrics),
      cognitiveFlexibility: this.calculateFlexibilityScore(metrics),
      sustainedAttention: this.calculateSustainedAttentionScore(metrics)
    };
  }

  calculateInattentionScore(metrics) {
    let score = 0;
    
    // Reaction time inconsistency (high variance indicates inattention)
    if (metrics.reactionTimeVariance > this.benchmarks.attentionConsistency.adhd.variance) {
      score += 0.3;
    }
    
    // Accuracy rate
    if (metrics.accuracyRate < this.benchmarks.accuracy.adhd.min) {
      score += 0.4;
    } else if (metrics.accuracyRate < this.benchmarks.accuracy.normal.min) {
      score += 0.2;
    }
    
    // High number of errors
    const errorScore = Math.min(metrics.totalErrors / 10, 0.3);
    score += errorScore;
    
    return Math.min(score, 1);
  }

  calculateImpulsivityScore(metrics) {
    let score = 0;
    
    // Fast incorrect responses (impulsive errors)
    if (metrics.impulsivityIndex > 0.6) {
      score += 0.5;
    }
    
    // Rule change performance
    if (metrics.ruleChangePerformance && metrics.ruleChangePerformance.adaptationTime > 
        this.benchmarks.ruleChangeAdaptation.adhd.time) {
      score += 0.3;
    }
    
    // Error patterns (clusters of errors)
    if (metrics.totalErrors > this.benchmarks.errors.adhd.min) {
      score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  calculateHyperactivityScore(metrics) {
    let score = 0;
    
    // Mouse movement complexity
    if (metrics.mousePathComplexity > 0.7) {
      score += 0.4;
    }
    
    // Hyperactivity index from mouse movements
    if (metrics.hyperactivityIndex > 0.6) {
      score += 0.4;
    }
    
    // High number of clicks (excessive activity)
    const totalClicks = metrics.totalErrors + (metrics.reactionTimes?.length || 0);
    if (totalClicks > 50) { // Arbitrary threshold
      score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  calculateWorkingMemoryScore(metrics) {
    // Inverse of inattention for memory-related tasks
    return Math.max(0, 1 - metrics.accuracyRate * 0.5 - metrics.totalErrors * 0.05);
  }

  calculateFlexibilityScore(metrics) {
    if (!metrics.ruleChangePerformance) return 0.5;
    
    let score = 0;
    
    if (metrics.ruleChangePerformance.errorRate > 0.5) {
      score += 0.4;
    }
    
    if (metrics.ruleChangePerformance.adaptationTime > 3000) {
      score += 0.3;
    }
    
    if (metrics.ruleChangePerformance.perseverationErrors > 2) {
      score += 0.3;
    }
    
    return Math.min(score, 1);
  }

  calculateSustainedAttentionScore(metrics) {
    // Based on attention span calculation
    const attentionScore = metrics.attentionSpan;
    
    if (attentionScore < 0.3) return 0.8;
    if (attentionScore < 0.6) return 0.5;
    return 0.2;
  }

  calculateADHDPercentage(indicators) {
    // Weighted calculation based on DSM-5 criteria
    const weights = {
      inattention: 0.35,
      impulsivity: 0.25,
      hyperactivity: 0.25,
      workingMemory: 0.08,
      cognitiveFlexibility: 0.07
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(weights).forEach(([indicator, weight]) => {
      if (indicators[indicator] !== undefined) {
        totalScore += indicators[indicator] * weight;
        totalWeight += weight;
      }
    });
    
    // Normalize to percentage
    const adhdPercentage = Math.round((totalScore / totalWeight) * 100);
    
    return Math.min(adhdPercentage, 100);
  }

  determineRiskLevel(percentage) {
    if (percentage < 30) return 'Low Risk';
    if (percentage < 50) return 'Mild Risk';
    if (percentage < 70) return 'Moderate Risk';
    return 'High Risk';
  }

  // Helper calculations
  calculateAverage(array) {
    if (!array || array.length === 0) return 0;
    return array.reduce((a, b) => a + b, 0) / array.length;
  }

  calculateVariance(array) {
    if (!array || array.length === 0) return 0;
    const avg = this.calculateAverage(array);
    const squareDiffs = array.map(value => Math.pow(value - avg, 2));
    return this.calculateAverage(squareDiffs);
  }

  calculateMouseComplexity(movements) {
    if (!movements || movements.length === 0) return 0;
    
    let totalPathLength = 0;
    let totalStraightness = 0;
    
    movements.forEach(movement => {
      if (movement.path && movement.path.length > 1) {
        // Calculate path length
        for (let i = 1; i < movement.path.length; i++) {
          const dx = movement.path[i].x - movement.path[i-1].x;
          const dy = movement.path[i].y - movement.path[i-1].y;
          totalPathLength += Math.sqrt(dx*dx + dy*dy);
        }
        
        // Calculate straightness (start to end distance vs path length)
        const start = movement.path[0];
        const end = movement.path[movement.path.length - 1];
        const directDistance = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        
        if (totalPathLength > 0) {
          totalStraightness += directDistance / totalPathLength;
        }
      }
    });
    
    // Low straightness = high complexity (hyperactive movements)
    const avgStraightness = totalStraightness / movements.length;
    return 1 - (avgStraightness || 0);
  }

  calculateHyperactivityIndex(movements) {
    if (!movements || movements.length === 0) return 0;
    
    let totalSpeedChanges = 0;
    let totalMovements = 0;
    
    movements.forEach(movement => {
      if (movement.path && movement.path.length > 2) {
        let speedChanges = 0;
        let lastSpeed = 0;
        
        for (let i = 1; i < movement.path.length; i++) {
          const timeDiff = movement.path[i].timestamp - movement.path[i-1].timestamp;
          if (timeDiff > 0) {
            const dx = movement.path[i].x - movement.path[i-1].x;
            const dy = movement.path[i].y - movement.path[i-1].y;
            const speed = Math.sqrt(dx*dx + dy*dy) / timeDiff;
            
            if (i > 1 && Math.abs(speed - lastSpeed) > 10) { // Threshold
              speedChanges++;
            }
            
            lastSpeed = speed;
          }
        }
        
        totalSpeedChanges += speedChanges;
        totalMovements++;
      }
    });
    
    return Math.min((totalSpeedChanges / totalMovements) / 10, 1);
  }

  calculateImpulsivityIndex(errors) {
    if (!errors || errors.length === 0) return 0;
    
    // Count rapid successive errors (within 500ms)
    let rapidErrors = 0;
    for (let i = 1; i < errors.length; i++) {
      const timeDiff = errors[i].timestamp - errors[i-1].timestamp;
      if (timeDiff < 500) {
        rapidErrors++;
      }
    }
    
    return Math.min(rapidErrors / errors.length, 1);
  }

  calculateAttentionSpan(reactionTimes) {
    if (!reactionTimes || reactionTimes.length < 5) return 0.5;
    
    // Split into quartiles and compare consistency
    const quartileSize = Math.floor(reactionTimes.length / 4);
    const quartileAverages = [];
    
    for (let i = 0; i < 4; i++) {
      const start = i * quartileSize;
      const end = start + quartileSize;
      const quartile = reactionTimes.slice(start, end);
      quartileAverages.push(this.calculateAverage(quartile));
    }
    
    // Calculate variance between quartiles
    const variance = this.calculateVariance(quartileAverages);
    const maxVariance = 1000; // Maximum expected variance
    
    return Math.max(0, 1 - (variance / maxVariance));
  }

  analyzeRuleChange(gameData) {
    // This would analyze specific rule change activity data
    // For now, return a mock analysis
    return {
      adaptationTime: 3500,
      errorRate: 0.6,
      perseverationErrors: 3,
      successfulAdaptation: false
    };
  }

  generateRecommendations(indicators, riskLevel) {
    const recommendations = [];
    
    if (indicators.inattention > 0.6) {
      recommendations.push({
        category: 'Attention',
        suggestion: 'Structured routines and visual schedules',
        activities: ['Puzzle completion tasks', 'Memory matching games']
      });
    }
    
    if (indicators.impulsivity > 0.6) {
      recommendations.push({
        category: 'Impulse Control',
        suggestion: 'Wait-time strategies and self-monitoring',
        activities: ['Turn-taking games', 'Stop-and-think exercises']
      });
    }
    
    if (indicators.hyperactivity > 0.6) {
      recommendations.push({
        category: 'Hyperactivity',
        suggestion: 'Movement breaks and fidget tools',
        activities: ['Yoga breaks', 'Theraputty exercises']
      });
    }
    
    if (riskLevel === 'High Risk' || riskLevel === 'Moderate Risk') {
      recommendations.push({
        category: 'Professional Support',
        suggestion: 'Consult with pediatrician or child psychologist',
        activities: ['Comprehensive evaluation', 'Behavioral therapy']
      });
    }
    
    return recommendations;
  }

  identifyStrengths(indicators) {
    const strengths = [];
    
    if (indicators.inattention < 0.4) {
      strengths.push('Good focus and attention to detail');
    }
    
    if (indicators.impulsivity < 0.4) {
      strengths.push('Strong impulse control and thoughtful responses');
    }
    
    if (indicators.workingMemory < 0.4) {
      strengths.push('Good working memory and recall ability');
    }
    
    if (indicators.cognitiveFlexibility < 0.4) {
      strengths.push('Flexible thinking and good adaptation to changes');
    }
    
    return strengths.length > 0 ? strengths : ['Enjoys digital activities and shows engagement'];
  }

  getDetailedAnalysis(indicators) {
    return {
      inattention: {
        score: indicators.inattention,
        description: indicators.inattention > 0.6 
          ? 'May have difficulty sustaining attention on tasks'
          : 'Shows good attention maintenance',
        examples: indicators.inattention > 0.6 
          ? ['Frequent off-task behavior', 'Difficulty following instructions']
          : ['Stays engaged with activities', 'Follows multi-step directions']
      },
      impulsivity: {
        score: indicators.impulsivity,
        description: indicators.impulsivity > 0.6
          ? 'May act without thinking through consequences'
          : 'Demonstrates good self-control',
        examples: indicators.impulsivity > 0.6
          ? ['Blurts out answers', 'Difficulty waiting turn']
          : ['Thinks before responding', 'Patient in activities']
      },
      hyperactivity: {
        score: indicators.hyperactivity,
        description: indicators.hyperactivity > 0.6
          ? 'May show excessive motor activity or restlessness'
          : 'Shows age-appropriate activity levels',
        examples: indicators.hyperactivity > 0.6
          ? ['Fidgets frequently', 'Difficulty staying seated']
          : ['Sits appropriately', 'Controls body movements']
      }
    };
  }
}