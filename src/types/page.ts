export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'projects';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}

export interface ProjectFigure {
    src: string;
    width: number;
    height: number;
    caption?: string;
    alt?: string;
    /** Span the full width of the figure grid (for dense multi-panel figures). */
    wide?: boolean;
}

export interface ProjectStat {
    value: string;
    label: string;
}

export interface ProjectItem {
    id: string;
    title: string;
    /** Short label for the in-page jump list; falls back to title. */
    short?: string;
    venue?: string;
    year?: string | number;
    status?: string;
    summary: string;
    tags?: string[];
    paper?: string;
    code?: string;
    stats?: ProjectStat[];
    figures?: ProjectFigure[];
    /** Markdown body. Use ### headings for sections. */
    content: string;
}

export interface ProjectsPageConfig extends BasePageConfig {
    type: 'projects';
    items: ProjectItem[];
}
