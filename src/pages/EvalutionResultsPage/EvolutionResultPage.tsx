import React from "react";
import { useParams } from "react-router-dom";
import sampleEvaluationData from "../../data/data";
import EvaluationHeader from "../../components/EvolutionResult/EvolutionHeader";
import EvaluationSummary from "../../components/EvolutionResult/EvolutionSummary";
import CategoryScores from "../../components/EvolutionResult/CategoryScores";
import EvaluationTabs from "../../components/EvolutionResult/EvolutionTabs";
import ExecutiveSummary from "../../components/EvolutionResult/ExecutiveSummary";

const EvaluationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const evaluationData = sampleEvaluationData;
  console.log(id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <EvaluationHeader
        title={`Evaluation ${evaluationData.date}`}
        date={evaluationData.date}
        time={evaluationData.time}
      />

      <EvaluationSummary
        overallScore={evaluationData.overallScore}
        documentCount={evaluationData.documentCount}
        documentType={evaluationData.documentType}
        strengths={evaluationData.strengths}
        areasForImprovement={evaluationData.areasForImprovement}
      />

      <CategoryScores scores={evaluationData.categoryScores} />

      <EvaluationTabs>
        <ExecutiveSummary summary={evaluationData.executiveSummary} />
      </EvaluationTabs>
    </div>
  );
};

export default EvaluationResultPage;
