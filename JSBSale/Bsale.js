
/* Declaracion de variables con las rutas de los end point a consumir */

const baseUrl="https://backendbsale.herokuapp.com",
        urlCategory = `${baseUrl}/category/v1/list`,
        urlProduct = `${baseUrl}/product/v1/listAll`,
        urlProductbyCategory = `${baseUrl}/product/v1/listByCategory/`,
        urlProductbyName = `${baseUrl}/product/v1/listByName`

/* Variable que sirve para obtener las url para la utilizacion de paginado */

let urlSelect =""

/* Declaracion de Variables para obtener los elementos a utilizar del formulario */

const d= document,
       $btnBuscar = d.getElementById("btnBuscar"),
       $txtBuscar = d.getElementById("txtBuscar"),
       $cboSize = d.getElementById("cboSize")

/* Funcion que se utiliza para consumir los end point del servicio, utilizando como parametros una cadena para la url,
    un boolean para identificar si el servicio usa paginacion(en las categorias es "false porque no usa paginacion"),
    el numero de la paginay la cantidad de elementos a mostrar, y retorna una lista dependiendo del servicio */

const getData = async (url,pagination=true,page=0,size=10) =>{

    try {
        urlSelect = url
        let urlData = new URL(urlSelect),
        params = {page:page, size:size}
        if(pagination) Object.keys(params).forEach(key => urlData.searchParams.append(key, params[key]))
        let options = {
            method: "GET",
            //mode: 'no-cors', // no-cors, *cors, same-origin
            headers: {
                "Content-type": "application/json"
                //'Access-Control-Allow-Origin': '*',
            },
        }
        let res = await fetch(urlData, options), list = await res.json()
        
        return list

    } catch (e) {
        console.log(e)
    }
}

/* Funcion que se utiliza para cargar las categorias, se envia como parametro la lista de las categorias obtenidas del servicio consumido*/

const loadCategories = (listCategory) =>{

    /* se declaran un fragment que sirve para mantener los elementos que se van creando del template
    ,el tCategories que es el template que contiene los elementos para la lista contenedora  y
     el ulCategory que es el contenedor principal que va a albergar los elementos del fragment y mostrar la lista de las categorias en el formulario*/
    let $fragment = d.createDocumentFragment(),
        $tCategories = d.getElementById('tCategories').content,
        $ulCategory = d.getElementById('dblist-Categories')

        /* Recorro la lista de categorias y por cada itercion se va creando una etiqueda "a" del template que contiene el nombre de la categoria,
            un atributo creado llamado "category" que almacena el id de las categorias, antes de terminar la iteracion se guarda todo los datos del tcategories
            dentro de copy y este se asigna al fragment, una vez terminada las iteraciones el fragment se agrega al contenendor uCategory para crear la lista completa*/
        
        listCategory.forEach(category => {
            $tCategories.querySelector('a').textContent = String(category.name).toUpperCase()
            $tCategories.querySelector('a').setAttribute('category',category.id)
            let $copy = d.importNode($tCategories,true)
            $fragment.appendChild($copy)
        });
        $ulCategory.appendChild($fragment)
}

/* Funcion que se utiliza para cargar los productos, se envia como parametro la lista de productos obtenidas del servicio consumido*/

const loadProducts = (listProduct) =>{

    /* Funcion para cargar la paginacion */
    loadPagination(listProduct.number,listProduct.totalPages);

    /* se declaran un fragment que sirve para mantener los elementos que se van creando del template
    ,el tProducts que es el template que contiene los elementos para mostrar en la pagina y
     el containtproducts que es el contenedor principal que va a albergar los elementos del fragment 
     y mostrar los productos en el formulario*/
   
    let $fragment = d.createDocumentFragment(),
        $tProducts = d.getElementById('tProducts').content,
        $containtproducts = d.getElementById('containt-products')
        
        /* Recorro la lista de productos y por cada itercion se va creando una etiqueta "img" para las imagenes, 
        "h8" para el nombre del producto y "p" para el precio, para el template, antes de terminar la iteracion 
        se guarda todo los datos del tProducts  dentro de copy y este se asigna al fragment,
        una vez terminada las iteraciones el fragment se agrega al contenendor containtproducts para mostar el producto en la pagina*/
        $containtproducts.innerHTML=""
        listProduct.content.forEach(product => {
            $tProducts.querySelector('img').setAttribute('src',(product.urlImage== undefined || product.urlImage== '')?'img/noimage.png':product.urlImage)
            $tProducts.querySelector('h8').textContent =  String(product.name).toUpperCase()
            $tProducts.querySelector('p').textContent = `$ ${product.price.toFixed(2)}`
            let $copy = d.importNode($tProducts,true)
            $fragment.appendChild($copy)
        });
        $containtproducts.appendChild($fragment)
}

/* Funcion que se utiliza para cargar la paginacion de los productos, se envia como parametro el numero de pagina y el total de paginas*/

const loadPagination = (pageNumber,totalPage) =>{

    /* se declaran un fragment que sirve para mantener los elementos que se van creando del template
    ,el tPagination que es el template que contiene los elementos para el paginado y
     el ulPagination que es el contenedor principal que va a albergar los elementos del fragment 
     y muestra el paginado en el formulario*/

    let $fragment = d.createDocumentFragment(),
        $tPagination = d.getElementById('tPagination').content,
        $ulPagination = d.getElementById('contain-pagination')
    
    /* Recorro en base la cantidad total de paginas y si en el caso que la iteracion actual correspondia a la pagina obtenida,
    en el tPagination se marca la pagina actual como activa, por cada itercion se va creando una etiqueta "a" para el numero de pagina a mostrar, 
    , antes de terminar la iteracion se guarda todo los datos del tPagination dentro de copy y este se asigna al fragment,
    una vez terminada las iteraciones el fragment se agrega al contenendor ulPagination para mostar las paginas y al final se invoca la funcion para
    generar las acciones de los botones para cambiar de pagina*/        
        
    $ulPagination.innerHTML=""
    for(let i=0;i<totalPage;i++){
      
            if(i==pageNumber){
                $tPagination.querySelector('li').classList.add("active")
            }
            $tPagination.querySelector('a').textContent = i+1
            let $copy = d.importNode($tPagination,true)
            $fragment.appendChild($copy)
            $tPagination.querySelector('li').classList.remove("active")
        }
    $ulPagination.appendChild($fragment)
    paginationAddEventListener()
}

/* Esta funcion sirve para realizar las acciones de mostrar los productos por categoria de la lista desplegable de categorias,
    lo que realiza es que se obtiene todo los elementos de la lista mediante la clase category que se le agrego anteriormente, 
    se recorre toda esos elementos y se le agrega las acciones por cada item y al hacer click en uno de los item se carga los producto segun lo seleccionado */

const categoryAddEventListener = ()=>{
    $aCategories = d.getElementsByClassName('category')
    Array.from($aCategories).forEach(element => {
        element.addEventListener("click",async ()=>{
            let idCategory=element.getAttribute('category'),
                url=(idCategory==0)?urlProduct:`${urlProductbyCategory}${idCategory}`
            
            listProduct =await getData(url)
            loadProducts(listProduct)  
        })
    });
}

/* Esta funcion sirve para realizar las acciones de mostrar los productos del paginado,
    lo que realiza es que se obtiene todo los elementos del paginado mediante la clase lipage, 
    se recorre toda esos elementos y se le agrega las acciones por cada item y al hacer click en uno de los item , 
    se llama a la funcion para marcar la pagina seleccionadase y carga los producto segun lo seleccionado */


const paginationAddEventListener = ()=>{
    $aPaginations = d.getElementsByClassName('lipage')
    Array.from($aPaginations).forEach((element,index) => {
        element.querySelector('a').addEventListener("click",async ()=>{
           let page = element.textContent
           selectPageActive (page - 1)
           listProduct = await getData(urlSelect,true,page-1)
           loadProducts(listProduct)
        })
    });
}

/* funcion para que la pagina seleccionada se marque como activa, lo que realiza es que se obtiene todo los elementos del paginado mediante la clase lipage
    , recorre los elementos que existan y si la pagina corresponde a la iteraccion se marca la pagina seleccionada */
const selectPageActive = (page) =>{
    $aPaginations = d.getElementsByClassName('lipage')
    Array.from($aPaginations).forEach((element,index) => {
        element.classList.remove("active")
        if(page==index){
            element.classList.add("active")
        }   
    });
}

/* funcion del DOM que se ejecuta al cargar pa lagina, se ejecuta la obtencion de la lista de categorias, la carga de las categorias en la lista desplegable,
    la obtencion de productos, la carga de los productos para visualizar y las acciones de la lista desplegable */

d.addEventListener("DOMContentLoaded", async() => {
        
    let listCategory = await getData(urlCategory,false);
    loadCategories(listCategory)
    let listProduct = await getData(urlProduct);
    loadProducts(listProduct)
    categoryAddEventListener()

})

/* funcion del evento click del boton de busqueda, obtine lo escrito en la caja de texto para enviarlo al servicio para obtener la lista de productos 
y posteriomente cargar los productos en la pagina */ 

$btnBuscar.addEventListener('click', async() => {

    let name = `?name=${$txtBuscar.value}`
    let listProduct = await getData(urlProductbyName+name);

    loadProducts(listProduct)

})

/* funcion del evento "change" de combo para le tama??o de productos a mostrar en la pagina, se envia la cantidad de elementos a mostrar al servicio para obtener los productos
    y posteriormente los carga para mostrar en la pagina, tambien se habilita las acciones de la lista desplegable de categorias */

$cboSize.addEventListener('change',async()=>{

    let listProduct = await getData(urlProduct,true,0,$cboSize.value);
    loadProducts(listProduct)
    categoryAddEventListener()

})