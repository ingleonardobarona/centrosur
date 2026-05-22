Vue.use(VueNumeric.default)


var app = new Vue({

  el: '#divWpVue',
  data: {
    config: {},
    smlmv: 0,
    valorInmueble: 0,
    valorMinInmueble: 0,
    cantidadAnos:1,
    cantidadMinAnos:1,
    cantidadMaxAnos:1,
    subsidio: 3,
    maxPorcentaFinanciar: 0,
    tipoAmortizacion: '',
    tipoAmortizacionList: [],
    prctgInicialList:[],
    prctgInicial: 20,
    interes: 0,
    bancos:['BancoBogota'],
    cuotaMensual: 0,
    cuotaMensual7anos: 0,
    errorMessage:'',
    sVida: 0,
    sIncenTerre: 0,
    vlrSubsidio: 0,
    intSubsidio: 0,
    currentSubsi: {}

  },
  computed:{
    cuotaInicial: {
      get: function () {
      return this.valorInmueble*(this.prctgInicial/100)
    },
      set: function (value) {
      }
    },
    valorFinanciar: {

      get: function () {
        return (this.valorInmueble-this.cuotaInicial)
      },
      set: function (value) {

      }
    },
    seguroIncendioTerremoto:{
      get: function (){
        this.sIncenTerre = Math.trunc(this.valorInmueble*0.00016)
        return this.sIncenTerre
      },
      set: function (value){
        return value;
      }
    ,
    },
    seguroVida: {
      get: function () {
        this.sVida = this.valorFinanciar*0.00026
        return this.sVida.toFixed(0)
      },
      set: function (value){
        return value;
      }
    }

   /* tipoAmortizacion: {
      get:function (){
        this.tipoAmortizacionList.forEach(item =>{
          if (item.name === tipoAmortizacion){
            return item
          }
        })
      },
      set: function (value) {
        this.tipoAmortizacionList.forEach(item =>{
          if (item.value === value){
            return item
          }
        })
      }
    }*/

  },
  methods:{
    calcularCuotas: function (){
      if (this.valorInmueble > 0 && this.tipoAmortizacion != '' && this.tipoAmortizacion != 'Seleccione una opción'){
        if(this.errorMessage.length != 0){
          this.errorMessage = ''
        }
        this.cuotaMensual = 0;
        var v = Math.pow(1 + (this.interes/100), (1/12))-1
        var mensualidad = ((Math.pow(1+v,(this.cantidadAnos*12))*v)/(Math.pow(1+v,(this.cantidadAnos*12))-1))*this.valorFinanciar
        var totMensualidad = mensualidad +  this.sIncenTerre + this.sVida
        this.cuotaMensual = totMensualidad.toFixed(0)
        if(this.vlrSubsidio > 0 ){
          this.cuotaMensual7anos = mensualidad - this.vlrSubsidio +  this.sIncenTerre + this.sVida
        }else if(this.intSubsidio > 0){
          console.log(this.intSubsidio)
          var v = Math.pow(1 + ((parseInt(this.intSubsidio))/100), (1/12))-1
          var mensualidad7anos = ((Math.pow(1+v,(this.cantidadAnos*12))*v)/(Math.pow(1+v,(this.cantidadAnos*12))-1))*this.valorFinanciar
          this.cuotaMensual7anos = mensualidad7anos +  this.sIncenTerre + this.sVida
        };
      }else if(this.valorInmueble > 0 && (this.tipoAmortizacion == ''  || this.tipoAmortizacion == 'Seleccione una opción' )){
        this.errorMessage = 'El tipo de amortización es obligatorio';
      }else if((this.tipoAmortizacion != '' && this.tipoAmortizacion != 'Seleccione una opción' ) && this.valorInmueble == 0 ){
        this.errorMessage = 'El valor del inmueble es obligatorio';
      }else{
        this.errorMessage = 'El valor del inmueble y el tipo de amortización son obligatorios';
      }

    },
    formatCurrency: function (number){
      const options2 = { style: 'currency', currency: 'COP' }
      var p = new Intl.NumberFormat('es-CO', options2)
      return p.format(number)
    },

    changeTAmortizacion: function () {
      try {
        this.calculateSubsidio()

        if(this.intSubsidio !== this.tipoAmortizacion.ea){
          this.interes  = this.tipoAmortizacion.ea
        }else{
          this.interes = this.tipoAmortizacion.ea
        }
        this.cantidadAnos = this.cantidadMinAnos = parseInt(this.tipoAmortizacion.minYears)
        this.cantidadMaxAnos = parseInt(this.tipoAmortizacion.maxYears)
        this.cuotaMensual = 0
        this.cuotaMensual7anos = 0
        console.log( 'change '+ typeof this.cantidadAnos)
        return
      }catch (e) {
        console.log(e)
        return e
      }
    },
    fillPercentageList: function () {
      var list = []
      for (var x = 20; x <= 60; x++){
        if( x % 5 === 0){
          list.push(x)
        }
      }
      return list
    },
    getJsonConfig: function (){
      fetch( directory_uri.plugin_dir+'config.json' ).then( resp =>
         resp.json()
      ).then(json => {
        this.tipoAmortizacionList = json.tiposFinanciacion
        this.smlmv = json.baseSalario
        this.subsidios = json.subsidios
      })
        .catch(err => console.log('Solicitud fallida', err));
    },
    calculateSubsidio: function (){
      console.log('llegue aca')
      this.vlrSubsidio = 0
      this.intSubsidio = 0
      var that = this
      this.currentSubsi = this.subsidios.find(function (el){
        return el.name === that.tipoAmortizacion.tipo
      })

      if(this.currentSubsi.subsidioTasa != "" && this.currentSubsi.name != 'Leasing'){
          this.intSubsidio = this.tipoAmortizacion.ea - this.currentSubsi.subsidioTasa
      }else if(this.currentSubsi.name != 'Leasing'){
          this.vlrSubsidio = (parseInt(this.smlmv )* parseInt(this.currentSubsi.cantSalarios))/parseInt(this.currentSubsi.cantCuotas)
          this.intSubsidio = this.tipoAmortizacion.ea
      }else {
        this.intSubsidio = 0
      }
      return;

    }
  },
  component:{
    'VueNumeric': VueNumeric
  },
  created(){
    this.getJsonConfig();
    this.tipoAmortizacion = {'name':'Seleccione una opción'}
    this.seguroIncendioTerremoto = 0
    this.seguroVida = 0
    this.prctgInicialList = this.fillPercentageList()
  }
})
