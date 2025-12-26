/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: categorietematiche
 * Interface for ThematicCategories
 */
export interface ThematicCategories {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  categoryKey?: string;
  /** @wixFieldType text */
  categoryName?: string;
  /** @wixFieldType text */
  categoryDescription?: string;
  /** @wixFieldType date */
  creationDate?: Date | string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType number */
  orderIndex?: number;
}


/**
 * Collection ID: libri
 * Interface for Books
 */
export interface Books {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  author?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType boolean */
  isMustRead?: boolean;
  /** @wixFieldType text */
  microReview?: string;
  /** @wixFieldType image */
  coverImage?: string;
  /** @wixFieldType number */
  yearRead?: number;
  /** @wixFieldType text */
  synopsis?: string;
}
