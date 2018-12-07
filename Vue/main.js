mockData();
class Model {
  constructor(opt) {
    this.origin = opt.origin;
    this.data = opt.data
  }
  get(id) {
    return axios.get(`/${this.origin}/${id}`).then((response) => {
      console.log(response)
      this.data = response.data;
      return response;
    })
  }
  put(data) {
    console.log(this.data)
    let id = this.data.id
    return axios.put(`/${this.origin}/${id}`, data).then((response) => {
      this.data = response.data;
      return response;
    })
  }
}

let xmodel = new Model({
  data: {
    name: '',
    number: 0,
    id: ''
  },
  origin: "baby"
})
let xview = new Vue({
  el: "#app",
  template: ` 
    <div>
       <h3>订购<span id="num">{{book.num}}</span>只<span id="name">{{book.name}}</span>~</h3>
       <button id="addOne" @click="addOne">再来一只</button>
       <button id="reduceOne"  @click="reduceOne">放弃一只</button>
       <button id="reset"  @click="reset">狠心清空</button>
    </div>
  `,
  data: {
    book: {
      name: '',
      num: 0,
      id: ''
    }
  },
  created() {
    xmodel.get('001').then(({
      data
    }) => {
      console.log('xxx',data)
      this.book = data;
    })
  },
  methods: {
    addOne() {
        let num = $("#num").text();
        let newNum = ++num;
        xmodel.put({
          num: newNum
        }).then(({
          data
        }) => {
          this.book = data;
        })
      },
      reduceOne() {
        let num = $("#num").text();
        let newNum = --num;
        if (newNum <= 0) {
          newNum = 0
        }
        xmodel.put({
            num: newNum
          })
          .then(({
            data
          }) => {
            this.book = data;
          })
      },
      reset() {
        xmodel.put({
            num: 0
          })
          .then(({
            data
          }) => {
            this.book = data;
          })
        alert("你怎么可以这么残忍！哼╭(╯^╰)╮");
      }
  }
})


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