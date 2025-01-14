import React from "react";
import {  useState, useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { Link ,useParams , useNavigate} from "react-router-dom";
import { modifyOperation , getIdOperation } from "../../actions";
import SelectCategories from "../create/SelectCategories";

import gifLoading from "../home/css/cargando.gif"
import homeStyles from "../home/css/Home.module.css"
import styles from "../create/css/OperationCreate.module.css";


function validate(input){
    const errors={}
    if(input.name.length > 19){
        errors.name = "Tiene que ser menor de 20 caracteres"
    }
    if(input.money < 0 || (input.money % 1) !== 0  ){
        errors.money= "El monto tiene que ser mayor a 0 y un numero entero"
    }
    return errors
}


export default function ModifyOperation(){
    const {id} = useParams()
    const idOperation = useSelector(state => state.operationId)

    console.log(id)
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() =>{
        dispatch(getIdOperation(id))
    },[dispatch,id])

    console.log(idOperation)
    console.log(idOperation.id !== id ? "esto es una prueba" : idOperation )
    // const {name , date , money , category} =  idOperation.id === id && idOperation


    const [data , setData] = useState({
        name: "",
        date: "",
        money: "",
        category: "",
    })
    const [errors , setErrors] = useState({})

    function handleSelect(event){
        setData(({
            ...data,
            category: event.target.value === "nada" ? data.category
            : event.target.value
        }));
        console.log(data)
    };

    function handleChange(event){
        setData(({
            ...data,
            [event.target.name] : event.target.value
        }))
        console.log(data)
        setErrors(validate({
            ...data,
            [event.target.name] : event.target.value
        }))
    }

    function handleSubmit(event){
        event.preventDefault();
        if(Object.values(errors).length > 0  ){
            return alert("Observa los errores que estan en color rojo!")
        }
        dispatch(modifyOperation(id, data) );
        alert("Operacion modificada!")
        setData({
            name: "",
            date: "",
            money:"",
            category:"", 
        })
        navigate("/")
    }

    const [time , setTime] = useState("cargando...")
    useEffect(()=>{ // cuando pase x tiempo el setTime se va a setear a  "PAGINA NO ENCONTRADA" para dejar de mostar  "cargando..."
        setTimeout(()=>{
            setTime("PAGINA NO ENCONTRADA") 
        },5000)
    },[])
    // console.log(time)

    if(Object.values(idOperation).length < 1 || time === "cargando..."){ // Object.values(idOperation) convierte el objeto en array
        return(
        <div style={{marginTop: "10px"}} className={styles.center} >
            {time === "cargando..." && <img className={homeStyles.imag} src={gifLoading} alt="cargando" />}
            <h1 className={homeStyles.notOperation}>{time}</h1>
            {time !== "cargando..." && 
            <h3  >La página que estás buscando no existe.
            Por favor, disculpa las molestias.</h3>
            }
            <Link to="/" ><button className={styles.botonHome} >volver al inicio</button></Link>
        </div>
        )
    }

        return(
            <div>
                <div className="dropdown">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <label tabindex="0" className="btn btn-ghost btn-circle " for="my-drawer" >
                            <svg id="my-drawer"  xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 6h16M4 12h16M4 18h15" /></svg>
                        </label>
                    </div> 
                    <div class="drawer-side">
                        <label for="my-drawer" className="drawer-overlay"></label>
                        <ul tabindex="0"  className="menu menu-compact dropdown-content mt-1 p-2 shadow bg-sky-300 rounded-box w-100">
                            <li> <Link to="/" className={styles.home} >Volver al inicio</Link> </li>
                            <li className={styles.ejemplo}  >agrandoBoooooooooooox</li>
                        </ul>
                    </div>
                </div>
                
                <h1 className={styles.titulo} >Modifica la operacion</h1>
                <div className={styles.box} >
                <form  onSubmit={event => handleSubmit(event)}  className={styles.formulario} >
                    <div>
                        {idOperation.type === "egreso" &&
                        <SelectCategories handleSelect={handleSelect}/>}
                        {!data.category && idOperation.type === "egreso" && 
                        <p style={{color:"black" ,fontWeight:700 , fontSize:14 }}>categoria actual: {idOperation.category} </p>}
                        {idOperation.type === "egreso" && <br/>}
                    </div>
                    <div>
                        <label >Conpeto: </label>
                        <input
                         placeholder={idOperation.name}
                         type="text"
                         value={data.name}
                         name="name"
                         onChange={event => handleChange(event)}
                         />
                        {errors.name && 
                         <p  style={{color: "red" , fontWeight: 700 , fontSize: 14}}  >{errors.name}</p>
                        }
                    </div>
                    <br />
                    <div>
                        <label >Fecha: </label>
                        <input
                         type="date"
                         name="date"
                         value={data.date}
                         onChange={event => handleChange(event)}
                         />
                        {!data.date && 
                        <p style={{color:"black" ,fontWeight:700 , fontSize:14 }}>fecha actual: {idOperation.date && idOperation.date.split("-").reverse().join("-")} </p>}
                    </div>
                    <br />
                    <div>
                        <label >Monto: </label>
                        <input
                         placeholder={idOperation.money}
                         type="number"
                         name="money"
                         value={data.money}
                         onChange={event => handleChange(event)}
                         />
                        {errors.money && 
                         <p  style={{color: "red" , fontWeight: 700 , fontSize: 14}}  >{errors.money}</p>
                        }
                    </div>
                    <br />
    
                    <button  className={ styles.btnCreate} type="submit"> Agregar operacion </button>
                </form>
                </div>
            </div>
        )

}