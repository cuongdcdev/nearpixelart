import React, {useState,useEffect,useRef} from 'react';
import CryptoJS from "crypto-js";
import  ReactCSSTransitionGroup  from 'react-addons-css-transition-group';

export default function CommentSection(){

    const [comments,setComments] = useState([]);
    const id = location.href.trim().split("/v/")[1];
    const inlineStyle = {
        cmtDate:{
            padding:'0px 5px'
        }
    }

    useEffect( ()=>{
        window.contract.getComments( {url: id} ).then( (res)=>{
        console.log("cmt list", res);
        if( !res ){
            console.log("0 comment!");
            return;
        }
            let strcomment = res.base64cmt;
            let arrCmt = [];
            strcomment.split("|").map( base64cmt => {
                if( base64cmt && base64cmt.length > 0  ){
                    let cmtObject =  JSON.parse( CryptoJS.enc.Base64.parse( base64cmt ).toString( CryptoJS.enc.Utf8 ) );
                    if( cmtObject.text &&  cmtObject.text.length > 0 ) arrCmt.push(  cmtObject); 
                }
            } );
            setComments( arrCmt );
            console.log("arrcmt" , arrCmt);
        } );

    } , []);


    function saveComment(){
        let cmtText = document.getElementById("cmtTextarea").value.trim();
        if( !cmtText ){
            alert("please leave comment!");
            return;
        }
        let cmtObject = {
            text: cmtText,
            author: window.accountId,
            time: Date.now()
        }

        let wordArray = CryptoJS.enc.Utf8.parse( JSON.stringify(cmtObject) );
        let base64cmt = CryptoJS.enc.Base64.stringify(wordArray);
        console.log( "cmtObject" , cmtObject );
        

        // comments.push( cmtObject );
        setComments([ cmtObject, ...comments ]);
        console.log(comments);
        document.getElementById("cmtTextarea").value = "";
        document.getElementById("btnSubmit").disabled = true;

        window.contract.addComment( { url: id, base64cmt } ).then((res)=>{
            console.log(res);
        });
    }

    function onChange(){
        let cmtText = document.getElementById("cmtTextarea").value.trim();
        document.getElementById("btnSubmit").disabled =  cmtText.trim().length > 0 ? false : true;
    }

    function getDateFromTimeStamp(unixTimeStamp) {
        let date = new Date(unixTimeStamp);
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }


    return (

        // comment section 

        <section className="bg-light">
            <div className="container py-3 ">
                <h2 className="fw-bolder mb-4">Comments</h2>


                {/* new comment  */}
                <div className="newPost">

                    <div id="newPostContainer" className="container-fluid"></div>

                    <div className="forumDivOuter">
                        <div id="forumDiv">
                            <textarea onChange={onChange} id="cmtTextarea" className="autoExpand forumPost form-control" rows="4" data-min-rows="4" placeholder="Leave your comment"></textarea>
                            <br />
                            <button id="btnSubmit" onClick={()=> saveComment() } className="forumPostButton btn btn-default">Post</button>
                        </div>
                    </div>
                </div>


                {/* comment list  */}
                    <div id="comment-list">
                        {
                            comments.map( (cmt,index) => (
                                <ReactCSSTransitionGroup key={Math.random()} transitionName ="commentEffect" transitionAppear={true} transitionAppearTimeout={1000} transitionEnter ={false} transitionLeave={false}>
                                <div className="comment"  cmt={index}> 
                                    <div className="col-md-12 col-md-offset-0"><div className="forumText forumMax">
                                        <p>{cmt.text}</p></div>
                                        <p className="forumTagline">
                                            <span className="forumName">{cmt.author} </span>
                                            <span className="text-muted"> <i className="fa fa-clock" style={inlineStyle.cmtDate}></i>{ getDateFromTimeStamp(cmt.time) }</span></p>
                                    </div>
                                </div>
                                </ReactCSSTransitionGroup>
                            ) )
                        }
                    </div>

            </div>
        </section>
    );


}
