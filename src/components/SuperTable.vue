<template>
  <div>
    <!-- 头部 -->
    <div class="hader rows" :style="`width:${listviewWidth}`">
      <!-- 头部每列 -->
      <div :style="`margin-left:-${x_scroll_Margin};`">
        <div
          class="column"
          v-for="(col,index) in columns"
          :key="index"
          :style="` text-align: ${col.align||'center'};width:${col.width||mean}px !important;height:${headerHeight}px;line-height: ${headerHeight}px !important;`"
        >
          <span v-if="col.el!='check'">{{ col.label}}</span>
          <el-checkbox v-else-if="col.el=='check'" v-model="selAll" @change="selectAll"></el-checkbox>
        </div>
      </div>
    </div>
    <div ref="elememt" class="list-view" @scroll="handleScroll" :style="`height:${showHeight}px`">
      <!-- 虚拟滚动条 -->
      <div class="list-view-empty" :style="{
        height: contentHeight
      }"></div>
      <!-- 数据内容区域 -->
      <div
        class="list-view-content"
        :style="`transform: translate3d(0, ${contentTopDistance}px, 0)`"
      >
        <!-- 数据遍历列 -->
        <div class="list-view-column" v-for="(col,index) in columns" :key="index">
          <!-- 数据遍历每一列的单元格 -->
          <div
            v-for="(row,index) in visibleData"
            :key="index"
            :style="`text-align: ${col.align};width:${col.width||mean}px  !important;height:${itemHeight}px`"
          >
            <div class="column">
              <div class="column-text">
                <template :slot-scope="row">
                  <slot :name="col.prop" :row="row" :index="row.$index">
                    <span v-if="!col.el">{{row[col.prop]}}</span>
                    <!-- 输入框 -->
                    <el-input
                      v-if="col.el=='input'"
                      size="mini"
                      placeholder="请输入内容"
                      v-model="row[col.prop]"
                    ></el-input>
                    <!-- 索引列 -->
                    <span v-else-if="col.el=='index'">{{ row.$index+1}}</span>
                    <!-- 时间 -->
                    <span
                      v-else-if="col.el=='date'"
                    >{{row[col.prop]&&row[col.prop].toString().substring(0,10)}}</span>
                    <!-- 按钮 -->
                    <el-button v-else-if="col.el=='button'" type="primary">{{col.lable}}</el-button>
                    <!-- 布尔值 -->
                    <span
                      v-else-if="col.el==='boolean'"
                    >{{row[col.prop]?$t('common.yes'):$t('common.no')}}</span>
                    <!-- 下拉框 -->
                    <el-select
                      style="min-width:100px"
                      v-else-if="col.el=='mSelect'"
                      v-model="row[col.prop]"
                      placeholder="请选择"
                      :disabled="col.disabled"
                      :clearable="true"
                      :size="'mini'"
                    >
                      <el-option
                        v-for="sel in col.listData"
                        :key="sel.value"
                        :label="$t(sel.label)"
                        :value="sel.value"
                      ></el-option>
                    </el-select>
                    <el-checkbox
                      v-else-if="col.el=='check'"
                      v-model="row.check"
                      @change="selectone(row.check)"
                    ></el-checkbox>
                  </slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="overflow: hidden;" v-if="paging">
      <el-pagination
        style="float:right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.index"
        :page-sizes="[100, 200, 300, 1000,2000,3000,10000]"
        :page-size="page.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "VirtualList",
  data() {
    return {
      mean: null, //单元格平均宽度
      visibleData: [], //展示数据
      cache: [], //缓存数据
      contentTopDistance: 0,
      x_scroll_Margin: "0px",
      selAll: false, //全选按钮
      listviewWidth: null,
      page: {
        index: 1,
        rows: 100
      }
    };
  },
  props: {
    // 参数:接收传入的数据
    tableData: {
      type: Array,
      required: true
    },
    // 参数:每个节点的高度
    itemHeight: {
      type: Number,
      default: 100
    },
    // 参数:头部行高度
    headerHeight: {
      type: Number,
      default: 50
    },
    // 参数:列数据
    columns: {
      type: Array,
      default: []
    },
    // 参数:展示区域高度
    showHeight: {
      type: Number,
      default: 300
    },
    // 参数:展示区域受否分页
    paging: {
      type: Boolean,
      default: false
    },
    // 参数:数据行数
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    //计算滚动总高度
    contentHeight() {
      return this.cache.length * this.itemHeight + "px";
    }
  },
  watch: {
    tableData(v) {
      //数据发生变化后   重新计算  为索引赋值
      console.log("数据改变");
      this.initialize();
    }
  },
  methods: {
    updateVisibleData(scrollTop = 0) {
      // 可见区域内列表数量
      const visibleCount = Math.ceil(
        this.$refs.elememt.clientHeight / this.itemHeight
      );
      // 可见区域内第一个 item 的 index
      const start = Math.floor(scrollTop / this.itemHeight);
      // 可见区域内最后一个 item 的 index
      const end = start + visibleCount + 6;
      // 可见区域的 列表
      this.visibleData = this.cache.slice(start, end);
      //计算出Y轴偏移量
      this.contentTopDistance = start * this.itemHeight;
    },
    handleScroll() {
      const scrollTop = this.$refs.elememt.scrollTop; //计算卷轮卷起来的高度
      this.x_scroll_Margin = this.$refs.elememt.scrollLeft + "px"; //计算头部列偏移量
      this.updateVisibleData(scrollTop);
    },
    selectone(v) {
      //单个勾选操作
      if (v === false) {
        this.selAll = false;
        this.handleScroll(); //重载视图
      } else {
        this.allTrue();
      }
      this.$emit(
        "selectChange",
        this.tableData.filter(item => item.check == true)
      ); //勾选回调
    },
    allTrue() {
      //检验全选框
      let allTrue = true;
      this.cache.forEach((item, index) => {
        if (item.check == false) {
          allTrue = false;
        }
      });
      this.selAll = allTrue;
      this.handleScroll(); //重载视图
    },
    selectAll() {
      //全选操作
      if (this.selAll === true) {
        this.cache.forEach((item, index) => {
          item.check = true; //给数据添加勾选
        });
      } else if (this.selAll === false) {
        this.cache.forEach((item, index) => {
          item.check = false; //给数据添加勾选
        });
      }
      this.$emit(
        "selectChange",
        this.tableData.filter(item => item.check == true)
      ); //勾选回调
      this.handleScroll(); //重载视图
    },
    handleSizeChange(val) {
      //切换数据条数回调
      this.page.rows = val;
      this.cache = this.tableData.slice(
        (this.page.index - 1) * this.page.rows,
        this.page.index * this.page.rows
      );
      this.allTrue(); //调用全选校验
      this.$emit("pageChange", this.page);
    },
    handleCurrentChange(val) {
      //切换页码回调
      this.page.index = val;
      this.cache = this.tableData.slice(
        (this.page.index - 1) * this.page.rows,
        this.page.index * this.page.rows
      );
      console.log(this.cache);
      //console.log( (this.page.index - 1) * this.page.rows,this.page.index * this.page.rows)
      this.allTrue(); //调用全选校验
      this.$emit("pageChange", this.page);
    },
    initialize() {
      //初始化加载
      this.tableData.forEach((item, index) => {
        item.$index = index; //给数据添加索引
        item.check = false; //给数据添加勾选
      });
      console.log(this.tableData);
      this.listviewWidth = this.$refs.elememt.offsetWidth + "px";
      this.mean = this.$refs.elememt.offsetWidth / this.columns.length; //计算每个单元格平均列宽
      if (this.paging == true) {
        //计算分页时每页缓存数据
        this.cache = this.tableData.slice(
          (this.page.index - 1) * this.page.rows,
          this.page.index * this.page.rows
        );
      } else {
        //计算不分页时缓存数据
        this.cache = this.tableData.slice(0, this.tableData.length);
      }
      this.handleScroll();
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.list-view {
  position: relative;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #ddd;
  white-space: nowrap;
  width: 100%;
}

.hader {
  overflow: hidden;
  background: #eef2f6;
  font-weight: 600;
  color: #000;
  z-index: 999;
}
.list-view-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.list-view-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.rows {
  white-space: nowrap;
}
.column {
  position: relative;
  display: inline-table;
  vertical-align: top;
  vertical-align: middle;
  height: 100%;
  width: 100%;
  font-size: 13px;
  letter-spacing: 2px;
  background: #fff;
}

.column::before {
  content: "";
  position: absolute;
  left: 0;
  width: 400%;
  height: 400%;
  border: 1px solid #909399;
  transform-origin: 0 0;
  transform: scale(0.25, 0.25);
  box-sizing: border-box;
}
.column-text {
  width: 100%;
  padding: 5px;
  font-size: 10px !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.list-view-column {
  color: #000;
  display: inline-block;
}
.list-view::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #fff;
}

.list-view::-webkit-scrollbar-track {
  border-radius: 3px;
}

.list-view::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #cedae6;
}
</style>



