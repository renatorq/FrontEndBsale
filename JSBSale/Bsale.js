
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
            $tCategories.querySelector('a').textContent = category.name
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
    ,el tProducts que es el template que contiene los elementos para la lista contenedora y
     el containtproducts que es el contenedor principal que va a albergar los elementos del fragment 
     y mostrar los productos en el formulario*/
   
    let $fragment = d.createDocumentFragment(),
        $tProducts = d.getElementById('tProducts').content,
        $containtproducts = d.getElementById('containt-products')
        
        /* Recorro la lista de productos y por cada itercion se va creando una etiqueta "img" para las imagenes, 
        "h7" para el nombre del producto y "p" para el precio, para el template, antes de terminar la iteracion 
        se guarda todo los datos del tProducts  dentro de copy y este se asigna al fragment,
        una vez terminada las iteraciones el fragment se agrega al contenendor containtproducts para mostar el producto en la pagina*/
        $containtproducts.innerHTML=""
        listProduct.content.forEach(product => {
            $tProducts.querySelector('img').setAttribute('src',(product.urlImage== undefined || product.urlImage== '')?'img/noimage.png':product.urlImage)
            $tProducts.querySelector('h7').textContent = product.name
            $tProducts.querySelector('p').textContent = `$ ${product.price.toFixed(2)}`
            let $copy = d.importNode($tProducts,true)
            $fragment.appendChild($copy)
        });
        $containtproducts.appendChild($fragment)
}

const loadPagination = (pageNumber,totalPage) =>{

    let $fragment = d.createDocumentFragment(),
        $tPagination = d.getElementById('tPagination').content,
        $ulPagination = d.getElementById('contain-pagination')
        
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

const selectPageActive = (page) =>{
    $aPaginations = d.getElementsByClassName('lipage')
    Array.from($aPaginations).forEach((element,index) => {
        element.classList.remove("active")
        if(page==index){
            element.classList.add("active")
        }   
    });
}

d.addEventListener("DOMContentLoaded", async() => {
        
    let listCategory = await getData(urlCategory,false);
    loadCategories(listCategory)
    let listProduct = await getData(urlProduct);
    loadProducts(listProduct)
    categoryAddEventListener()

})

$btnBuscar.addEventListener('click', async() => {

    let name = `?name=${$txtBuscar.value}`
    let listProduct = await getData(urlProductbyName+name);
    console.log(listProduct)

    loadProducts(listProduct)

})

$cboSize.addEventListener('change',async()=>{

    let listProduct = await getData(urlProduct,true,0,$cboSize.value);
    loadProducts(listProduct)
    categoryAddEventListener()

})