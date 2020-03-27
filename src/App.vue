<template>
  <div id="app">
    <SuperTable
      :tableData="tableData"
      :columns="columns"
      :showHeight="500"
      @pageChange="pageChange"
      @selectChange="selectChange"
      :itemHeight="40"
      :paging="false"
      :total='total'
    >
      <template slot="name" slot-scope="scope">{{scope.row.name}}</template>
      <template slot="age" slot-scope="scope">{{scope.row.age}}</template>
      <template slot="deleter" slot-scope="scope">
        <el-button type="primary" @click="del(scope.row.$index)">删除</el-button>
      </template>
    </SuperTable
    >
  </div>
</template>

<script>
import SuperTable from "./components/SuperTable.vue";


export default {
  name: "app",
  components: {
    SuperTable,

  },
  data() {
    return {
      tableData: [],
      total:0,
      columns: [
        {
          el:'check',
          width:50,
          align: "center"
        },
        {
          label: "#",
          el: "index",
          width:50,
          align: "center"
        },
        {
          label: "姓名1",
          prop: "name",
          align: "center"
        },
        {
          label: "年纪2",
          prop: "age",
          align: "center",
           width:'400',
          el: "input"
        },
     
        {
          label: "性别10",
          prop: "sex",
          align: "center",
          width:'500',
          el: "select",
          listData: [
            {
              value: "选项1",
              label: "黄金糕"
            },
            {
              value: "选项2",
              label: "双皮奶"
            }
          ]
          // disabled:true,
        },
        {
          label: "地址11",
          prop: "arress",
          align: "center",
          // width:'200',
          el: "input"
        },
        {
          label: "地址12",
          prop: "arress",
          align: "center",
          // width:'200',
          el: "button"
        },
         {
          label: "操作13",
          prop: "deleter",
          align: "center",
          fixed:'right'
        }
      ]
    };
  },
  created() {
    let arr = [];
    const randomColor = () => {
      return Math.floor(Math.random() * 255);
    };
    for (let i = 0; i < 10000; i++) {
      arr.push({
        name: "张三",
        age: i + 1,
        arress: i + "性别",
        text: `这是第${i}条数据`
      });
    }
    this.tableData = arr;
    this.total=this.tableData.length
  },
  methods: {
    pageChange(v) {
      console.log(v);
    },
    selectChange(v){
      console.log(v);
    },
    del(v){
      console.log("索引为",v)
      this.tableData.splice(v,1)
    }
  }
};
</script>


