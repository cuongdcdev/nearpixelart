import { addComment,addEntity, getComments, getEntities, getEntity} from '../index';
import {Comment, comments, entities} from '../model';

import { storage, Context } from 'near-sdk-as'

const uniqueUrl = 'uniqueurl';

describe( 'Test load entities on Home page' , ()=>{

  it( 'retrieves 3 entities in Home page', ()=>{
    for( let i:i32 = 0 ; i < 3 ; i++ ){
      addEntity( 'title' , 'content' , 'imagebase64' , 'uniqueurl' + i.toString() );
    }

    const entitiesArr = getEntities(0,3);

    expect(entitiesArr.length).toBe(
      3,
      'should be 3 entities in home page'
    );


  } );
} );//test homepage 


describe('Test single entity page' , ()=>{
  
  it( 'should show only 1 single entity' , ()=>{
    addEntity( 'title' , 'content' , 'imagebase64' , uniqueUrl  );
    expect( getEntity(uniqueUrl) ).not.toBeNull();
  } );


  it('should able to save and get comment' ,() => {
    let cmt = "base64 concant of list comments";
    addComment(uniqueUrl , cmt );
    expect(getComments(uniqueUrl)).not.toBeNull();
  } );

});//test single entity page 


//test create entity page 
describe('Test create entity' , ()=>{
  
  it( 'should able to create entity', ()=>{
    addEntity( 'title' , 'content' , 'imagebase64' , uniqueUrl);
    expect( getEntity(uniqueUrl) ).not.toBeNull();
  } );
});




