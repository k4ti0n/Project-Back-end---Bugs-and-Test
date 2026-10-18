from sqlalchemy import Column, String, Integer, Boolean, Date, ForeignKey
from Banco.database import Base


class Engine(Base):
    __tablename__ = "engines"

    Engine_ID = Column("Engine_ID", Integer, primary_key=True, autoincrement=True)
    Name_Engine = Column("Name_Engine", String, nullable=False)

    def __init__(self, Name_Engine):
        self.Name_Engine = Name_Engine


class ProjectingDocumentation(Base):
    __tablename__ = "projecting_documentation"

    Game_ID = Column("Game_ID", Integer, primary_key=True, autoincrement=True)
    Game_Name = Column("Game_Name", String, nullable=False)
    Game_Status = Column("Game_Status", String, nullable=False)

    def __init__(self, Game_Name, Game_Status):
        self.Game_Name = Game_Name
        self.Game_Status = Game_Status


class AssociationProjectAndEngine(Base):
    __tablename__ = "association_project_and_engine"

    Engine_ID = Column("Engine_ID", ForeignKey("engines.Engine_ID"), primary_key=True)
    Game_ID = Column("Game_ID", ForeignKey("projecting_documentation.Game_ID"), primary_key=True)

    def __init__(self, Engine_ID, Game_ID):
        self.Engine_ID = Engine_ID
        self.Game_ID = Game_ID


class Function(Base):
    __tablename__ = "functions"

    Function_ID = Column("Function_ID", Integer, primary_key=True, autoincrement=True)
    Name_Function = Column("Name_Function", String, nullable=False)

    def __init__(self, Name_Function):
        self.Name_Function = Name_Function


class Professional(Base):
    __tablename__ = "professionals"

    Professional_ID = Column("Professional_ID", Integer, primary_key=True, autoincrement=True)
    Nome = Column("Nome", String, nullable=False)
    Active = Column("Active", Boolean, default=True)

    def __init__(self, Nome, Active=True):
        self.Nome = Nome
        self.Active = Active


class FunctionProfessional(Base):
    __tablename__ = "function_professional"

    Professional_ID = Column("Professional_ID", ForeignKey("professionals.Professional_ID"), primary_key=True)
    Function_ID = Column("Function_ID", ForeignKey("functions.Function_ID"), primary_key=True)

    def __init__(self, Professional_ID, Function_ID):
        self.Professional_ID = Professional_ID
        self.Function_ID = Function_ID


class DocumentationBug(Base):
    __tablename__ = "documentation_bug"

    Documentation_Bug_ID = Column("Documentation_Bug_ID", Integer, primary_key=True, autoincrement=True)
    Date_Reported = Column("Date_Reported", Date, nullable=False)
    Place_game = Column("Place_game", String, nullable=False)
    cause = Column("cause", String)
    Step_Reproduction = Column("Step_Reproduction", String, nullable=False)
    
    Game_ID = Column("Game_ID", ForeignKey("projecting_documentation.Game_ID"), nullable=False)
    Reported_ID = Column("Reported_ID", ForeignKey("professionals.Professional_ID"), nullable=False)
    Responsible_ID = Column("Responsible_ID", ForeignKey("professionals.Professional_ID"), nullable=False)

    def __init__(self, Date_Reported, Place_game, cause, Step_Reproduction, Game_ID, Reported_ID, Responsible_ID):
        self.Date_Reported = Date_Reported
        self.Place_game = Place_game
        self.cause = cause
        self.Step_Reproduction = Step_Reproduction
        self.Game_ID = Game_ID
        self.Reported_ID = Reported_ID
        self.Responsible_ID = Responsible_ID


class BugHistory(Base):
    __tablename__ = "bug_history"

    History_ID = Column("History_ID", Integer, primary_key=True, autoincrement=True)
    Documentation_Bug_ID = Column("Documentation_Bug_ID", ForeignKey("documentation_bug.Documentation_Bug_ID"), nullable=False)
    Change_Date = Column("Change_Date", Date, nullable=False)
    Status_Situation = Column("Status_Situation", String, nullable=False)
    Professional_ID = Column("Professional_ID", ForeignKey("professionals.Professional_ID"), nullable=False)

    def __init__(self, Documentation_Bug_ID, Change_Date, Status_Situation, Professional_ID):
        self.Documentation_Bug_ID = Documentation_Bug_ID
        self.Change_Date = Change_Date
        self.Status_Situation = Status_Situation
        self.Professional_ID = Professional_ID