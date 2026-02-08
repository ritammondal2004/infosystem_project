from dataclasses import dataclass
from typing import Optional


@dataclass
class Video:
    """Video data model"""
    id: str
    title: str
    description: str
    source_type: str  # "REMOTE" or "LOCAL"
    meta: dict
    
    @classmethod
    def from_json(cls, data: dict) -> 'Video':
        """
        Transform JSON storage format into Video model
        
        Storage format: {"id": "...", "type": "youtube", "src": "..."}
        Model format: Video with source_type and structured meta
        """
        is_remote = data.get('type') == 'youtube'
        
        meta = {}
        if is_remote:
            meta = {
                "external_id": data.get('src'),
                "provider": "youtube",
                "embed_url": f"https://www.youtube.com/embed/{data.get('src')}"
            }
        
        return cls(
            id=data.get('id'),
            title=data.get('title'),
            description=data.get('description', ''),
            source_type="REMOTE" if is_remote else "LOCAL",
            meta=meta
        )
    
    def to_dict(self) -> dict:
        """Convert to API response format"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "source_type": self.source_type,
            "meta": self.meta
        }
