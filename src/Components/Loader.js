import LoaderStyle from '../Styles/Loader.module.css';

export default function Loader(){
    return(
        <div className={LoaderStyle.container}>
            <div className={LoaderStyle.loader}>
                
            </div>
            <br/>
            <h2>Espere unos segundos</h2>
        </div>
        
    )
}