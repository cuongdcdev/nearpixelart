import { Context, logging, storage } from 'near-sdk-as'
import { Entity, entities, Comment, comments } from './model';


/**
 * Add art picture and save to NEAR blockchain
 * @param title 
 * @param content 
 * @param image 
 * @param url 
 * @returns 
 */
export function addEntity(title: string, content: string, image: string, url: string): boolean {
  const newEntity = new Entity(title, content, image, url);
  entities.set(url, newEntity);
  return true;
}

/**
 * Get art picture 
 * @param url 
 * @returns 
 */
export function getEntity(url: string): Entity | null {
  const userEntity = entities.get(url);
  assert(userEntity, "loi ko ghet dc entity ");
  return userEntity;
}
/**
 * get entities, support pagination 
 * @param from 
 * @param to 
 * @returns 
 */
export function getEntities(from: i32, to: i32): Entity[] {
  return entities.values(from, to);
}

/**
 * Add comment to a string of base64 encoded, seperated by |, url is the ID of art entity 
 * @param url 
 * @param base64cmt 
 * @returns 
 */
export function addComment(url: string, base64cmt: string): boolean {
  const oldComments = comments.get(url);
  if (oldComments) {
    comments.set(url, new Comment(oldComments.base64cmt + "|" + base64cmt));
  } else {
    comments.set(url, new Comment(base64cmt));
  }
  return true;
}
/**
 * Return Comment object contains list of base64 encoded comments, sperated by |   
 * @param url 
 * @returns 
 */
export function getComments(url: string): Comment | null {
  return comments.get(url);
}
