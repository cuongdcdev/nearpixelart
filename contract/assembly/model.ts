import { context, u128, PersistentVector, PersistentUnorderedMap } from "near-sdk-as";


@nearBindgen
/**
 * Comment, just contains string base64 encoded comment, seperated by | 
 * comment json encoded, structure: { author: string, content: string , date: date_in_unixtimestamp } 
 */
export class Comment {
  base64cmt: string;
  constructor(base64cmt: string) {
    this.base64cmt = base64cmt;
  }
}


@nearBindgen
/**
 * Class art image 
 */
export class Entity {
  content: string;
  author: string;
  title: string;
  image: string;
  url: string; //unique url 

  constructor(title: string, content: string, image: string, url: string) {
    this.content = content;
    this.title = title;
    this.image = image;
    this.author = context.sender;
    this.url = url;
  }

}




/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const entities = new PersistentUnorderedMap<string, Entity>("pixel_arts3");
export const comments = new PersistentUnorderedMap<string, Comment>("pixel_comments3");
