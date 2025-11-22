import LoaderStyle from '../Styles/Loader.module.css';

export default function Loader(){
    return(
        <div className={LoaderStyle.container}>
            <div className={LoaderStyle.loaderWrapper}>
                <div className={LoaderStyle.spinner}>
                    <div className={LoaderStyle.spinnerRing}></div>
                    <div className={LoaderStyle.spinnerRing}></div>
                    <div className={LoaderStyle.spinnerRing}></div>
                </div>
                <div className={LoaderStyle.logo}>
                    <img src="/imagenes/LogoBoletaYa.ico" alt="Logo" />
                </div>
            </div>
            <h2 className={LoaderStyle.text}>Cargando...</h2>
            <div className={LoaderStyle.dots}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )
}