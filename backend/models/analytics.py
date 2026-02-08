from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class AnalyticsResult:
    status: str
    metrics: Dict[str, Any]
    plots: Dict[str, str]
    
    def to_dict(self) -> dict:
        return {
            "status": self.status,
            "metrics": self.metrics,
            "plots": self.plots
        }