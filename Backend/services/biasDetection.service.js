class BiasDetectionService {
  /**
   * Analyze bias in ranked applications
   * @param {Array} rankedApplications - Array of ranked applications
   * @returns {Object} - Bias analysis results
   */
  analyzeBias(rankedApplications) {
    try {
      if (!rankedApplications || rankedApplications.length === 0) {
        return {
          hasBias: false,
          message: 'No applications to analyze',
          demographicBias: null,
          scoreDistributionBias: null,
          fairnessMetrics: null
        };
      }

      const demographicBias = this.analyzeDemographicBias(rankedApplications);
      const scoreDistributionBias = this.analyzeScoreDistributionBias(rankedApplications);
      const fairnessMetrics = this.calculateFairnessMetrics(rankedApplications);

      const hasBias = demographicBias.hasBias || scoreDistributionBias.hasBias;

      return {
        hasBias,
        message: hasBias ? 'Potential bias detected in rankings' : 'No significant bias detected',
        demographicBias,
        scoreDistributionBias,
        fairnessMetrics
      };
    } catch (error) {
      console.error('Error analyzing bias:', error);
      return {
        hasBias: false,
        message: 'Error occurred during bias analysis',
        demographicBias: null,
        scoreDistributionBias: null,
        fairnessMetrics: null
      };
    }
  }

  /**
   * Analyze demographic bias in rankings
   * @param {Array} rankedApplications - Array of ranked applications
   * @returns {Object} - Demographic bias analysis
   */
  analyzeDemographicBias(rankedApplications) {
    try {
      // Assume demographic data is available in application.applicant.profile.demographics
      // This is a placeholder - actual implementation would depend on your data structure
      const allCandidates = rankedApplications;
      const topCandidates = rankedApplications.slice(0, Math.ceil(rankedApplications.length * 0.2)); // Top 20%

      // Example demographics: gender, ethnicity, etc.
      const demographics = ['gender', 'ethnicity', 'age_group'];

      let hasBias = false;
      const biasDetails = {};

      demographics.forEach(demo => {
        const allDistribution = this.getDemographicDistribution(allCandidates, demo);
        const topDistribution = this.getDemographicDistribution(topCandidates, demo);

        const biasResult = this.analyzeDemographicGroup(allDistribution, topDistribution);
        biasDetails[demo] = biasResult;

        if (biasResult.hasBias) {
          hasBias = true;
        }
      });

      return {
        hasBias,
        details: biasDetails
      };
    } catch (error) {
      console.error('Error analyzing demographic bias:', error);
      return {
        hasBias: false,
        details: null
      };
    }
  }

  /**
   * Group candidates by experience level
   * @param {Array} candidates - Array of candidates
   * @returns {Object} - Candidates grouped by experience
   */
  groupByExperience(candidates) {
    const groups = {
      '0-2 years': [],
      '3-5 years': [],
      '6+ years': []
    };

    candidates.forEach(candidate => {
      const experience = candidate.application?.job?.experienceLevel || '0-2 years';

      if (experience <= 2) {
        groups['0-2 years'].push(candidate);
      } else if (experience <= 5) {
        groups['3-5 years'].push(candidate);
      } else {
        groups['6+ years'].push(candidate);
      }
    });

    return groups;
  }

  /**
   * Analyze bias for a specific demographic group
   * @param {Object} allDistribution - Distribution in all candidates
   * @param {Object} topDistribution - Distribution in top candidates
   * @returns {Object} - Bias analysis for the group
   */
  analyzeDemographicGroup(allDistribution, topDistribution) {
    const totalAll = Object.values(allDistribution).reduce((sum, count) => sum + count, 0);
    const totalTop = Object.values(topDistribution).reduce((sum, count) => sum + count, 0);

    if (totalAll === 0 || totalTop === 0) {
      return { hasBias: false, message: 'Insufficient data' };
    }

    let hasBias = false;
    const groupBiases = {};

    Object.keys(allDistribution).forEach(group => {
      const allRatio = allDistribution[group] / totalAll;
      const topRatio = (topDistribution[group] || 0) / totalTop;
      const ratio = topRatio / allRatio;

      groupBiases[group] = {
        allRatio: allRatio.toFixed(3),
        topRatio: topRatio.toFixed(3),
        representationRatio: ratio.toFixed(3)
      };

      // Flag bias if representation ratio is outside 0.7-1.3 range
      if (ratio < 0.7 || ratio > 1.3) {
        hasBias = true;
      }
    });

    return {
      hasBias,
      message: hasBias ? 'Under/over-representation detected' : 'Balanced representation',
      groupBiases
    };
  }

  /**
   * Analyze score distribution bias
   * @param {Array} rankedApplications - Array of ranked applications
   * @returns {Object} - Score distribution bias analysis
   */
  analyzeScoreDistributionBias(rankedApplications) {
    try {
      if (rankedApplications.length < 5) {
        return {
          hasBias: false,
          message: 'Insufficient data for score distribution analysis'
        };
      }

      const scores = rankedApplications.map(app => app.score).filter(score => score > 0);

      if (scores.length < 5) {
        return {
          hasBias: false,
          message: 'Insufficient valid scores for analysis'
        };
      }

      // Calculate statistics
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
      const stdDev = Math.sqrt(variance);

      // Categorize scores
      const highScores = scores.filter(score => score >= mean + stdDev).length;
      const mediumScores = scores.filter(score => score >= mean - stdDev && score < mean + stdDev).length;
      const lowScores = scores.filter(score => score < mean - stdDev).length;

      const totalScores = scores.length;
      const highPercent = (highScores / totalScores) * 100;
      const mediumPercent = (mediumScores / totalScores) * 100;
      const lowPercent = (lowScores / totalScores) * 100;

      // Check for clustering bias (>80% in one category)
      const hasBias = highPercent > 80 || mediumPercent > 80 || lowPercent > 80;

      return {
        hasBias,
        message: hasBias ? 'Score distribution shows clustering bias' : 'Score distribution appears balanced',
        statistics: {
          mean: mean.toFixed(2),
          stdDev: stdDev.toFixed(2),
          highScores: `${highScores} (${highPercent.toFixed(1)}%)`,
          mediumScores: `${mediumScores} (${mediumPercent.toFixed(1)}%)`,
          lowScores: `${lowScores} (${lowPercent.toFixed(1)}%)`
        }
      };
    } catch (error) {
      console.error('Error analyzing score distribution bias:', error);
      return {
        hasBias: false,
        message: 'Error occurred during score distribution analysis'
      };
    }
  }

  /**
   * Calculate fairness metrics
   * @param {Array} rankedApplications - Array of ranked applications
   * @returns {Object} - Fairness metrics
   */
  calculateFairnessMetrics(rankedApplications) {
    try {
      // Demographic parity: P(Y=1|D=d) should be equal across demographic groups
      // Equal opportunity: P(Y=1|Y*=1,D=d) should be equal across demographic groups
      // Simplified implementation - actual metrics would require ground truth labels

      return {
        demographicParity: {
          description: 'Proportion of positive outcomes should be equal across groups',
          note: 'Requires ground truth hiring data for accurate calculation'
        },
        equalOpportunity: {
          description: 'True positive rate should be equal across groups',
          note: 'Requires ground truth qualification data for accurate calculation'
        },
        note: 'Fairness metrics calculation requires additional data (hiring outcomes, qualification labels) for complete analysis'
      };
    } catch (error) {
      console.error('Error calculating fairness metrics:', error);
      return null;
    }
  }
}

export default new BiasDetectionService();
