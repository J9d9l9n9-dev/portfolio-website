"""upgrade_portfolio_cms_schema

Revision ID: 4b9ce721ef9a
Revises: 3a4cb6a3fd8c
Create Date: 2026-10-03 23:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4b9ce721ef9a'
down_revision: Union[str, Sequence[str], None] = '3a4cb6a3fd8c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema safely by creating media_assets and adding nullable extension columns."""
    # 1. Create media_assets table
    op.create_table(
        'media_assets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('public_id', sa.String(length=255), nullable=True),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('secure_url', sa.String(length=500), nullable=False),
        sa.Column('format', sa.String(length=50), nullable=True),
        sa.Column('size_bytes', sa.Integer(), nullable=True),
        sa.Column('width', sa.Integer(), nullable=True),
        sa.Column('height', sa.Integer(), nullable=True),
        sa.Column('content_type', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_media_assets_id'), 'media_assets', ['id'], unique=False)

    # 2. Add nullable columns to profiles
    op.add_column('profiles', sa.Column('cta_text', sa.String(length=100), nullable=True))
    op.add_column('profiles', sa.Column('cta_url', sa.String(length=255), nullable=True))
    op.add_column('profiles', sa.Column('secondary_cta_text', sa.String(length=100), nullable=True))
    op.add_column('profiles', sa.Column('secondary_cta_url', sa.String(length=255), nullable=True))
    op.add_column('profiles', sa.Column('avatar_image', sa.String(length=255), nullable=True))
    op.add_column('profiles', sa.Column('about_heading', sa.String(length=255), nullable=True))
    op.add_column('profiles', sa.Column('about_description', sa.Text(), nullable=True))
    op.add_column('profiles', sa.Column('about_paragraphs', sa.JSON(), nullable=True))
    op.add_column('profiles', sa.Column('about_highlights', sa.JSON(), nullable=True))
    op.add_column('profiles', sa.Column('about_image', sa.String(length=255), nullable=True))

    # 3. Add nullable columns to site_settings
    op.add_column('site_settings', sa.Column('site_title', sa.String(length=150), nullable=True))
    op.add_column('site_settings', sa.Column('site_description', sa.Text(), nullable=True))
    op.add_column('site_settings', sa.Column('seo_title', sa.String(length=150), nullable=True))
    op.add_column('site_settings', sa.Column('seo_description', sa.Text(), nullable=True))
    op.add_column('site_settings', sa.Column('favicon_url', sa.String(length=255), nullable=True))
    op.add_column('site_settings', sa.Column('og_image_url', sa.String(length=255), nullable=True))
    op.add_column('site_settings', sa.Column('footer_text', sa.String(length=255), nullable=True))
    op.add_column('site_settings', sa.Column('location', sa.String(length=150), nullable=True))
    op.add_column('site_settings', sa.Column('default_profile_image', sa.String(length=255), nullable=True))
    op.add_column('site_settings', sa.Column('default_resume_url', sa.String(length=255), nullable=True))

    # 4. Add nullable columns to education
    op.add_column('education', sa.Column('institution', sa.String(length=150), nullable=True))
    op.add_column('education', sa.Column('field_of_study', sa.String(length=150), nullable=True))
    op.add_column('education', sa.Column('grade_cgpa', sa.String(length=50), nullable=True))
    op.add_column('education', sa.Column('location', sa.String(length=100), nullable=True))
    op.add_column('education', sa.Column('logo_url', sa.String(length=255), nullable=True))
    op.add_column('education', sa.Column('start_date', sa.String(length=50), nullable=True))
    op.add_column('education', sa.Column('end_date', sa.String(length=50), nullable=True))
    op.add_column('education', sa.Column('description', sa.Text(), nullable=True))

    # 5. Add nullable columns to experience
    op.add_column('experience', sa.Column('location', sa.String(length=100), nullable=True))
    op.add_column('experience', sa.Column('start_date', sa.String(length=50), nullable=True))
    op.add_column('experience', sa.Column('end_date', sa.String(length=50), nullable=True))
    op.add_column('experience', sa.Column('is_current', sa.Boolean(), nullable=True))
    op.add_column('experience', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('experience', sa.Column('technologies', sa.JSON(), nullable=True))
    op.add_column('experience', sa.Column('company_logo', sa.String(length=255), nullable=True))

    # 6. Add nullable columns to projects
    op.add_column('projects', sa.Column('short_description', sa.Text(), nullable=True))
    op.add_column('projects', sa.Column('full_description', sa.Text(), nullable=True))
    op.add_column('projects', sa.Column('start_date', sa.String(length=50), nullable=True))
    op.add_column('projects', sa.Column('end_date', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema safely."""
    op.drop_column('projects', 'end_date')
    op.drop_column('projects', 'start_date')
    op.drop_column('projects', 'full_description')
    op.drop_column('projects', 'short_description')

    op.drop_column('experience', 'company_logo')
    op.drop_column('experience', 'technologies')
    op.drop_column('experience', 'description')
    op.drop_column('experience', 'is_current')
    op.drop_column('experience', 'end_date')
    op.drop_column('experience', 'start_date')
    op.drop_column('experience', 'location')

    op.drop_column('education', 'description')
    op.drop_column('education', 'end_date')
    op.drop_column('education', 'start_date')
    op.drop_column('education', 'logo_url')
    op.drop_column('education', 'location')
    op.drop_column('education', 'grade_cgpa')
    op.drop_column('education', 'field_of_study')
    op.drop_column('education', 'institution')

    op.drop_column('site_settings', 'default_resume_url')
    op.drop_column('site_settings', 'default_profile_image')
    op.drop_column('site_settings', 'location')
    op.drop_column('site_settings', 'footer_text')
    op.drop_column('site_settings', 'og_image_url')
    op.drop_column('site_settings', 'favicon_url')
    op.drop_column('site_settings', 'seo_description')
    op.drop_column('site_settings', 'seo_title')
    op.drop_column('site_settings', 'site_description')
    op.drop_column('site_settings', 'site_title')

    op.drop_column('profiles', 'about_image')
    op.drop_column('profiles', 'about_highlights')
    op.drop_column('profiles', 'about_paragraphs')
    op.drop_column('profiles', 'about_description')
    op.drop_column('profiles', 'about_heading')
    op.drop_column('profiles', 'avatar_image')
    op.drop_column('profiles', 'secondary_cta_url')
    op.drop_column('profiles', 'secondary_cta_text')
    op.drop_column('profiles', 'cta_url')
    op.drop_column('profiles', 'cta_text')

    op.drop_index(op.f('ix_media_assets_id'), table_name='media_assets')
    op.drop_table('media_assets')
