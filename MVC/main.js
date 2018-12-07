
// https://jsbin.com/bijebisufo/edit?html,js,output
mockData();

// M 
class Model {
  constructor(opt) {
    this.origin = opt.origin;
    this.data = opt.data
  }
  get(id) {
    return axios.get(`/${this.origin}/${id}`).then((response) => {
      console.log(response.data)
      this.data = response.data;
      console.log(this.data)
      return response
    })
  }
  put(data) {
    console.log(this.data)
    let id = this.data.id
    return axios.put(`/${this.origin}/${id}`, data).then((response)=>{
      this.data = response.data;
      return response;
    })
  }
}

// V
class View {
  constructor(opt) {
    this.el = $(opt.el);
    this.template = opt.template;
  }
  render(data) {
    let text = this.template.replace('{{num}}', data.num).replace("{{name}}", data.name);
    this.el.html(text);
  }
}


// C
class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }
  init() {
    this.model.get('001')
      .then(({
        data
      }) => {
        this.view.render(data);
      })
    this.bindEvents()
  }
  bindEvents() {
    $(this.view.el).on("click", '#addOne', this.addOne.bind(this))
    $("#app").on("click", '#reduceOne', this.reduceOne.bind(this))
    $("#app").on("click", "#reset", this.reset.bind(this))
  }
  addOne() {
    let num = $("#num").text();
    let newNum = ++num;
    this.model.put({
      num: newNum
    }).then(({
      data
    }) => {
     this.view.render(this.model.data)
    })
  }
  reduceOne() {
    let num = $("#num").text();
    let newNum = --num;
    if (newNum <= 0) {
      newNum = 0
    }
    this.model.put({
        num: newNum
      })
      .then(({
        data
      }) => {
        this.view.render(this.model.data)
      })
  }
  reset() {
    this.model.put({
        num: 0
      })
      .then(({
        data
      }) => {
        this.view.render(this.model.data)
      })
    alert("你怎么可以这么残忍！哼╭(╯^╰)╮");
  }
}

let xview = new View({
  el: "#app",
  template: ` 
     <h3>订购<span id="num">{{num}}</span>只<span id="name">{{name}}</span>~</h3>
     <button id="addOne">再来一只</button>
     <button id="reduceOne">放弃一只</button>
     <button id="reset">狠心清空</button>
    `,
})
let xmodel = new Model({
  data: {
    name: '',
    number: 0,
    id: ''
  },
  origin:"baby"
  
})
let xcontroller = new Controller(xview, xmodel);
xcontroller.init();





function mockData() {
  let normalData = {
    name: "赵丽颖",
    num: 1,
    id: '001'
  }
  axios.interceptors.response.use(function(response) {
    let {
      url, data, method
    } = response.config;
    if (url === '/baby/001' && method === "get") {
      response.data = normalData;
    }
    if (url === '/baby/001' && method === "put") {
      response.data = Object.assign(normalData, JSON.parse(data)); //2.获取的是string
    }
    return response;
  })
}