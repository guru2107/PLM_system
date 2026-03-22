"""add approver_user_id to eco_stages

Revision ID: 2d4a1a8b9c01
Revises: d6fac1d26e89
Create Date: 2026-03-22 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2d4a1a8b9c01'
down_revision: Union[str, Sequence[str], None] = 'd6fac1d26e89'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('eco_stages', sa.Column('approver_user_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'eco_stages', 'users', ['approver_user_id'], ['id'])


def downgrade() -> None:
    op.drop_constraint(None, 'eco_stages', type_='foreignkey')
    op.drop_column('eco_stages', 'approver_user_id')
