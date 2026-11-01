from typing import Annotated, Literal

from pydantic import BaseModel, Field

ShortText = Annotated[str, Field(min_length=1, max_length=120)]
Text = Annotated[str, Field(min_length=1, max_length=500)]


class ClarificationAnswer(BaseModel):
    question: str = Field(min_length=1, max_length=300)
    answer: str = Field(min_length=1, max_length=1000)


class ProjectInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    category: str = Field(default="General", max_length=60)
    requirement: str = Field(min_length=20, max_length=5000)
    clarifications: list[ClarificationAnswer] = Field(default_factory=list, max_length=8)


class AnalyzeRequest(ProjectInput):
    pass


class BlueprintRequest(ProjectInput):
    pass


class ClarificationQuestion(BaseModel):
    question: str = Field(min_length=5, max_length=300)
    reason: str = Field(min_length=3, max_length=300)


class AnalysisResult(BaseModel):
    summary: str = Field(min_length=10, max_length=1000)
    objectives: list[str] = Field(max_length=10)
    main_functionalities: list[str] = Field(max_length=20)
    user_roles: list[str] = Field(max_length=10)
    missing_information: list[str] = Field(max_length=10)
    ambiguities: list[str] = Field(max_length=10)
    technical_considerations: list[str] = Field(max_length=10)
    assumptions: list[str] = Field(max_length=10)
    clarification_questions: list[ClarificationQuestion] = Field(default_factory=list, max_length=8)


class AnalyzeResponse(AnalysisResult):
    is_demo: bool


class DocumentSection(BaseModel):
    title: ShortText
    content: list[Text] = Field(min_length=1, max_length=12)


class TableColumn(BaseModel):
    name: ShortText
    data_type: ShortText
    constraints: str = Field(default="", max_length=200)


class DatabaseTable(BaseModel):
    name: ShortText
    purpose: Text
    columns: list[TableColumn] = Field(min_length=1, max_length=30)


class Relationship(BaseModel):
    from_table: ShortText
    to_table: ShortText
    cardinality: Literal["one_to_one", "one_to_many", "many_to_many"]
    description: Text


class ArchitectureComponent(BaseModel):
    name: ShortText
    responsibility: Text
    technology: ShortText


class ArchitectureLink(BaseModel):
    from_component: ShortText
    to_component: ShortText
    label: ShortText


class BlueprintResult(BaseModel):
    document_sections: list[DocumentSection] = Field(min_length=1, max_length=12)
    database_tables: list[DatabaseTable] = Field(min_length=1, max_length=15)
    relationships: list[Relationship] = Field(default_factory=list, max_length=25)
    architecture_components: list[ArchitectureComponent] = Field(min_length=1, max_length=12)
    architecture_links: list[ArchitectureLink] = Field(default_factory=list, max_length=25)


class BlueprintResponse(BlueprintResult):
    is_demo: bool
