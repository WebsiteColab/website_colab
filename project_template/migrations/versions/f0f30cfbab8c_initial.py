"""initial

Revision ID: f0f30cfbab8c
Revises: 
Create Date: 2023-09-08 12:49:35.745734

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f0f30cfbab8c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('books',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('book_url', sa.String(length=128), nullable=True),
    sa.Column('star_url', sa.String(length=128), nullable=True),
    sa.Column('text', sa.String(length=128), nullable=True),
    sa.Column('price_dollars', sa.Float(), nullable=True),
    sa.Column('quantity_count', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('books', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_books_book_url'), ['book_url'], unique=True)
        batch_op.create_index(batch_op.f('ix_books_star_url'), ['star_url'], unique=False)
        batch_op.create_index(batch_op.f('ix_books_text'), ['text'], unique=False)

    op.create_table('customer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=64), nullable=True),
    sa.Column('last_name', sa.String(length=64), nullable=True),
    sa.Column('email', sa.String(length=64), nullable=True),
    sa.Column('address', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('customer', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_customer_email'), ['email'], unique=False)

    op.create_table('registered_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=64), nullable=True),
    sa.Column('last_name', sa.String(length=64), nullable=True),
    sa.Column('email', sa.String(length=64), nullable=True),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('registered_users', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_registered_users_email'), ['email'], unique=True)
        batch_op.create_index(batch_op.f('ix_registered_users_first_name'), ['first_name'], unique=False)
        batch_op.create_index(batch_op.f('ix_registered_users_last_name'), ['last_name'], unique=False)
        batch_op.create_index(batch_op.f('ix_registered_users_password_hash'), ['password_hash'], unique=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('registered_users', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_registered_users_password_hash'))
        batch_op.drop_index(batch_op.f('ix_registered_users_last_name'))
        batch_op.drop_index(batch_op.f('ix_registered_users_first_name'))
        batch_op.drop_index(batch_op.f('ix_registered_users_email'))

    op.drop_table('registered_users')
    with op.batch_alter_table('customer', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_customer_email'))

    op.drop_table('customer')
    with op.batch_alter_table('books', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_books_text'))
        batch_op.drop_index(batch_op.f('ix_books_star_url'))
        batch_op.drop_index(batch_op.f('ix_books_book_url'))

    op.drop_table('books')
    # ### end Alembic commands ###