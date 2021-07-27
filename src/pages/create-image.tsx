import React, { useState, useEffect } from 'react';
import pixelitCDC from '../jslib/pixelit';
import CryptoJS from 'crypto-js';
import LoadingOverlay from 'react-loading-overlay';

const BOATLOAD_OF_GAS = 300000000000000;

//status
const STATUS_CREATED_IMAGE = 'pixe_generated';
const STATUS_SAVING = 'saving';
const STATUS_WAITING = 'waiting'; 


class CreateImagePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: STATUS_WAITING
        }
    }

    
    componentWillMount(){
        document.title = "Create pixel art!";
    }


    saveImage() {
        if (!confirm("confirm create?")) return;

        let mainCanvas = this.refs.canvas;
        let title = this.refs.post_title.value;
        let content = this.refs.post_content.value;
        let entityUrl = CryptoJS.MD5(window.accountId + "_" + Date.now() + "_" + Math.random()).toString();
        //save data url 
        console.log("title: " + title + "|| content: " + content);
        if (title.length > 0 && content.length > 0 && this.state.status == STATUS_CREATED_IMAGE) {

            let entity = {
                title: title,
                content: content,
                image: mainCanvas.toDataURL(),
                url: entityUrl,
            };
            console.log("entity", entity);
            this.setState( {status: STATUS_SAVING } );

            window.contract.addEntity(
                entity, BOATLOAD_OF_GAS, 0).then((data) => {
                    console.log("data returned :", data);
                    // alert("Created!");
                    location.href = "/v/" + entityUrl;
                }).finally(() => {
                    console.log("finished the call! ");
                });
        } else {
            alert("Please fill all required fields!");
        }


    }//saveImage


    processImage() {
        try {
            let img = this.refs.imgOrigin.files[0];
            let imgtemp = this.refs.imgtemp;
            let reader = new FileReader();
            let mainCanvas = this.refs.canvas;
            let _this = this;

            reader.readAsDataURL(img);

            console.log("main canvas", mainCanvas);


            reader.addEventListener("load", function () {

                console.log('processed image ', reader.result);
                imgtemp.src = reader.result;
                 

                imgtemp.addEventListener("load", function () {
                    const px = new pixelitCDC({
                        to: mainCanvas,
                        from: imgtemp,
                        scale: 19,
                        maxHeight: 600,
                        maxWidth: 600,
                        // palette : [[r,g,b]]
                    });
                    px.draw().pixelate().resizeImage().convertPalette();
                    _this.setState( {status: STATUS_CREATED_IMAGE} );
                })
            });//render img load 
        } catch (e) {
            alert("Please choose image first!");
        }

    }

    render() {
        return (
            <div className="create-image-page">


                <section className="body-wrap">

                    <div id="header_top_intro" className="header_top_create_image">
                        <h2 className=" mb-4 font-italic" > Create your masterpiece! </h2>
                    </div>

                <LoadingOverlay
                active={ this.state.status == STATUS_SAVING }
                spinner
                text='Creating, you will be redirected after done ....'
                >
                    <div className="container px-12 px-lg-5 my-5">
                        <div className="row gx-4 gx-lg-5">
                            <div className="col-md-6">

                                <div id="imgPreview">
                                    
                                    <input className="col-8" type="file" accept="image/*" ref="imgOrigin" placeholder="Upload an image:" />
                                    <button className="col-4" ref="convert" id="convert" onClick={() => this.processImage()}>Convert now </button>

                                    <img ref="imgtemp" src="" alt="" id="imagetemp" />
                                </div>

                                <div id="canvas-wrapper" className="card-img-top mb-5 mb-md-0">
                                    <canvas id="canvas" ref="canvas"></canvas>
                                </div>

                            </div>
                            <div className="col-md-6">

                                <input className=" fw-bolder col-12" ref="post_title" placeholder="your masterpiece title" />

                                <textarea className="post_content col-12"
                                    ref="post_content"></textarea>

                                <div className="d-flex">
                                    <button ref="save"
                                        id="save"
                                        onClick={() => this.saveImage()}
                                        className="btn btn-outline-dark flex-shrink-0 col-12 ">Create!  </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </LoadingOverlay>

                </section>

            </div>




        )//return html 
    }

}

export default CreateImagePage;

