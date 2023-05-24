import { useEffect, useState } from 'react';
import { stateForGradientImages,
        guideColor,
        squareColor,
        waitCapturingTime,
        needCountPhoto,
        rangeColor,
        deltaAngle } from './config';

const Sphere = (props) => {

    // Capture image
    const { captureImage } = props;

    const [deviceGamma1, setGamma1] = useState(0);
    const [deviceGamma2, setGamma2] = useState(0);

    var degtorad = Math.PI / 180; // Degree-to-Radian conversion
    
    function compassHeading(alpha, beta, gamma) {
    
        var _x = beta ? beta * degtorad : 0; // beta value
        var _y = gamma ? gamma * degtorad : 0; // gamma value
        var _z = alpha ? alpha * degtorad : 0; // alpha value
    
        var cX = Math.cos(_x);
        var cY = Math.cos(_y);
        var cZ = Math.cos(_z);
        var sX = Math.sin(_x);
        var sY = Math.sin(_y);
        var sZ = Math.sin(_z);
    
        // Calculate Vx and Vy components
        var Vx = - cZ * sY - sZ * sX * cY;
        var Vy = - sZ * sY + cZ * sX * cY;
    
        // Calculate compass heading
        var compassHeading = Math.atan(Vx / Vy);
    
        // Convert compass heading to use whole unit circle
        if (Vy < 0) {
            compassHeading += Math.PI;
        } else if (Vx < 0) {
            compassHeading += 2 * Math.PI;
        }
    
        return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
    
    }
    
    if (!sessionStorage.getItem("images")) {
        sessionStorage.setItem("images", JSON.stringify([]));
    }
    if (!sessionStorage.getItem("state")) {
        sessionStorage.setItem(
            "state",
            JSON.stringify(stateForGradientImages)
        );
    }
    
    // auto started device orientation
    const deviceOrientationHandler = (event) => {
        if( event != null ) {
    
            let alpha = (event.alpha).toFixed(1);
            let beta = (event.beta).toFixed(1);
            let gamma = (event.gamma).toFixed(1);

            setGamma1(gamma);
        
            alpha = (180 - compassHeading(alpha, beta, gamma)).toFixed(1);
            if (beta > 85 && beta < 95)
                gamma = 0;

            setGamma2(gamma);
        
            const displayCover = document.querySelector(".display-cover");
            const gradientImages = document.querySelector(".gradient-images");
            const centerCircle = document.querySelector(".center");
            const centerSquare = document.querySelector(".square");
        
            //when already photographed needCountPhoto(38) photos
            if (sessionStorage.getItem("countPhoto")) {
                if (+sessionStorage.getItem("countPhoto") === needCountPhoto) {
                    centerCircle.style.display = "none";
                    centerSquare.style.display = "none";
                    gradientImages.style.display = "none";
                }
            }
        
            const transformStyleGenerator = (gradient, beta, translateX, gamma) => {
                return `translate(${translateX}vw, ${-(gradient.beta - beta)}vh)
                                perspective(300px)
                                rotateY(${-translateX * 1.5}deg)
                                rotateX(${-(gradient.beta - beta)}deg)
                                rotateZ(${gamma}deg)`;
            };
        
            gradientImages.innerHTML = "";
            const state = JSON.parse(sessionStorage.getItem("state"));
            state?.forEach((gradient) => {
                if (gradient.forCircles) {
                    const div = document.createElement("div");
                    div.className = `div-${gradient.name} parentForCircles`;
                    gradientImages.appendChild(div);
                }
                const readyForScreenShot = () => {
                    if (document.querySelector(`.circleBig_${gradient.id}`)) {
                        document.querySelector(`.circleBig_${gradient.id}`).remove();
                        document.querySelector(`.guideDiv_${gradient.id}`).remove();
                    }
                    if (!gradient.readyToPhotographed) {
                        const time = new Date().getTime();
                        sessionStorage.setItem("fixTime", time);
                        centerCircle.style.background = guideColor;
                        centerSquare.style.background = squareColor;
                        gradient.readyToPhotographed = true;
                    } else {
                        if (sessionStorage.getItem("fixTime")) {
                            if (
                                new Date().getTime() - waitCapturingTime >
                                sessionStorage.getItem("fixTime")
                            ) {
                                gradient.photographed = true;
                                centerCircle.style.background = "none";
                                centerSquare.style.background = "none";
                                gradient.readyToPhotographed = false;
                                // To do capture image
                                // doScreenshot(gradient);
                                // captureImage();
                            }
                        }
                    }
                };
                const forRemoveCircleAndWarningText = () => {
                    if (document.querySelector(`.circleBig_${gradient.id}`)) {
                        document.querySelector(`.circleBig_${gradient.id}`).remove();
                        document.querySelector(`.guideDiv_${gradient.id}`).remove();
                    }
                    gradient.readyToPhotographed = false;
                };
                const guidePosition = () => {
                    gradient.readyToPhotographed = false;
                    document.querySelector(`.smallCircle${gradient.id}`).style.background = rangeColor;
        
                    let translateX = -(gradient.alpha - alpha) * (deltaAngle < 25 ? 3 : 2);
                    if (gradient.name === "ceiling") {
                        translateX = 0;
                    }
                    if (!document.querySelector(`.circleBig_${gradient.id}`)) {
                        centerCircle.style.background = "none";
                        centerSquare.style.background = "none";
                        const guideDiv = document.createElement("div");
                        const guideCircle = document.createElement("div");
                        guideDiv.className = `guideDiv guideDiv_${gradient.id}`;
                        guideCircle.className = `circleBig circleBig_${gradient.id}`;
                        displayCover.appendChild(guideDiv);
                        displayCover.appendChild(guideCircle);
                        guideCircle.style.transform = transformStyleGenerator(
                            gradient,
                            beta,
                            translateX,
                            gamma
                        );
                        guideDiv.style.transform = transformStyleGenerator(
                            gradient,
                            beta,
                            translateX,
                            gamma
                        );
                    } else {
                        document.querySelector(
                            `.circleBig_${gradient.id}`
                        ).style.transform = transformStyleGenerator(
                            gradient,
                            beta,
                            translateX,
                            gamma
                        );
                        document.querySelector(
                            `.guideDiv_${gradient.id}`
                        ).style.transform = transformStyleGenerator(
                            gradient,
                            beta,
                            translateX,
                            gamma
                        );
                    }
                };
                const span = document.createElement("span");
                span.className = gradient.photographed
                    ? `photographed circle smallCircle${gradient.id}`
                    : `noPhotographed circle smallCircle${gradient.id}`;
                if (gradient.readyToPhotographed) {
                    span.classList.add("readyPhotographed");
                }
                document.querySelector(`.div-${gradient.name}`).appendChild(span);
        
        
                if (
                    (
                        gradient.alpha - 5 < alpha &&
                        gradient.alpha + 5 > alpha &&
                        gradient.beta + 5 > beta &&
                        gradient.beta - 5 < beta &&
                        gradient.alpha > 85 &&
                        gradient.alpha < 95 &&
                        !gradient.photographed) ||
                    (
                        gradient.alpha - 5 < alpha &&
                        gradient.alpha + 5 > alpha &&
                        gradient.beta + 5 > beta &&
                        gradient.beta - 5 < beta &&
                        5 > gamma &&
                        gamma > -5 &&
                        !gradient.photographed) ||
                    (
                        (gradient.name === "ceiling" || gradient.name === "floor") &&
                        gradient.beta + 5 > beta &&
                        gradient.beta - 5 < beta &&
                        5 > gamma &&
                        gamma > -5 &&
                        !gradient.photographed
                    )) {
                    readyForScreenShot();
                    if (document.querySelector(`.circleBig_${gradient.id}`)) {
                        document.querySelector(`.circleBig_${gradient.id}`).remove();
                        document.querySelector(`.guideDiv_${gradient.id}`).remove();
                    }
                } else if (
                    (
                        gradient.alpha - 30 < alpha &&
                        gradient.alpha + 30 > alpha &&
                        gradient.beta + 60 > beta &&
                        gradient.beta - 60 < beta &&
                        !gradient.photographed) ||
                    (
                        (gradient.name === "ceiling" || gradient.name === "floor") &&
                        gradient.beta + 60 > beta &&
                        gradient.beta - 60 < beta &&
                        !gradient.photographed)
        
                ) {
                    if (!gradient.photographed) {
                        guidePosition();
                    } else {
                        document.querySelector(
                            `.smallCircle${gradient.id}`
                        ).style.background = rangeColor;
                        forRemoveCircleAndWarningText();
                    }
                } else {
                    forRemoveCircleAndWarningText();
                }
            }
        
            );
            sessionStorage.setItem("state", JSON.stringify([...state]));
        }
    }

    useEffect(() => {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
        
        return () => {
            window.removeEventListener('deviceorientation', deviceOrientationHandler);
        }
    }, []);

    return <div>
        <span>Gamma1 = {deviceGamma1}</span>
        <br />
        <span>Gamma2 = {deviceGamma2}</span>
    </div>;
}

export default Sphere;


