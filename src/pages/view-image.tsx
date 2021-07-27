import React, {useState,useEffect,useRef} from 'react';
import CommentSection from './comment-section';


const  ViewImagePage = () => {

    const [entity,setEntity] = useState([]);
    const id = location.href.trim().split("/v/")[1];
    const shareItem = {
        fb: "https://www.facebook.com/sharer/sharer.php?u="+location.href ,
        twt: "https://twitter.com/intent/tweet?text="+location.href,
        mail: "mailto:" + location.href
    }
    useEffect( ()=>{

        if( id.length <= 0 ){
            alert('not found! ');
            return;
        }
        console.log("id: "  + id );
        window.contract.getEntity( {url: id } ).then((res) => {
            console.log(res);
            setEntity(res);
            document.title = res.title;
        });

    },[] );





    return (
            //view image section 
            <div className="view-image-page" >
                <script src="https://cdn.jsdelivr.net/sharer.js/latest/sharer.min.js"></script>

                <section className="body-wrap">

                    <div className="container px-12 px-lg-5 my-5">
                        
                        <div className="row gx-4 gx-lg-5">
                            <div className="col-md-6">

                                <div id="canvas-wrapper" className="card-img-top mb-5 mb-md-0">
                                    <img src={entity.image} className="image_main_view"
                                    id="canvas" {useRef("canvas")} />
                                </div>

                            </div>

                            <div className="col-md-6">

                            <div className="social">
                                Share:
                                    <a href={shareItem.fb} id="share-fb" className="sharer button"><i className="fab fa-facebook"></i></a>
                                    <a href={shareItem.twt} id="share-tw" className="sharer button"><i className="fab fa-twitter"></i></a>
                                    <a href={shareItem.mail} id="share-em" className="sharer button"><i className="fas fa-envelope-open"></i></a>
                            </div>

                                <h3 className="post_title fw-bolder col-12" {useRef("post_title")} >{entity.title}</h3>

                              

                                <div className="post_content col-12"
                                    {useRef("post_content")} >{entity.content}</div>

                            </div>
                        </div>

                        <div className="commentList">
                            <CommentSection />
                        </div>
                    </div>
                </section>



            </div> //end all section 

        )//return html 

}

export default ViewImagePage;

