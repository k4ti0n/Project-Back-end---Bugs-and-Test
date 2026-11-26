"""Add the engine function column.

Revision ID: c107f248d2a1
Revises: 98dbbc125e31
Create Date: 2026-11-25
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c107f248d2a1"
down_revision: Union[str, Sequence[str], None] = "98dbbc125e31"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "engines",
        sa.Column("Function_Engine", sa.String(), server_default="", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("engines", "Function_Engine")
