# vue-virtual-list


Vue 虚拟列表组件
该组件是用来处理大数据解决数据量过大页面崩溃的表格组件
# 运行方式
1. npm install 
2. npm run serve
# 支持能力
1. 分页
2. 自定义插槽
3. 大数据加载
# 调用参数
1. 必要参数:
    - 表格数据:tableData: { type: Array}
    - 每个节点高度:itemHeight: {type: Number,default: 100}
    - 表格列头高度 headerHeight: {type: Number,default: 50}
    - 列信息:columns: { type: Array,default: []},
    - 数据总行数:total
2. 可选参数
    - 是否进行分页: {type: Boolean,default: false}
    - 展示区域高度:showHeight: {type: Number, default: 300}
3. 回调函数
    - 分页按钮点击回调: @pageChange
    - 数据勾选回调: @selectChange
4. 示例
    
    >``` 
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
    >```
    >```
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
    }
    >```