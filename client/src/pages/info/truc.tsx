import style from "./truc.module.css";

function truc() {

    return (
        <div className={style.videoContainer}>
            <video
                autoPlay
                muted
                loop
                playsInline
                className={style.backgroundVideo}
            >
                <source src="../../public/animation.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas les vidéos HTML5.
            </video>
            </div>
    )
}

export default truc