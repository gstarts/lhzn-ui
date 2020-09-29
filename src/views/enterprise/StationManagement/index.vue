<template>
  <div>
    <el-table :data="configList"  @selection-change="AutomaticDeclaration" v-loading="loading" >
      <el-table-column label="场站编号" prop="id" align="center"></el-table-column>
      <el-table-column label="场站名称" prop="atationinfo.stationName" align="center">
        
      </el-table-column>
      <el-table-column label="是否自动申报" prop="isDeclare" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isDeclare" 
             active-value="1" 
             inactive-value="0"
             @change="AutomaticDeclaration(scope.row)"
             ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否自动录入" prop="isEntry" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEntry"
            active-value="1"
            inactive-value="0"
            @change="InputClick(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="散杂货是否自动申报" prop="isDeclareGoods" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDeclareGoods"
            active-value="1"
            inactive-value="0"
            @change="BulkCargoDeclaration(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfigEntry,
  updateConfigDeclare,
  updateConfigDeclareGoods,
  exportConfig,
} from "@/api/enterprise/config";

export default {
  name: "Config",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stationId: undefined,
        isDeclare: undefined,
        isEntry: undefined,
        isDeclareGoods: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    
    this.getList();
     this.getDicts("station_name").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: { 
    /** 查询场站配置列表 */
    getList() {
      listConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.configList = response.rows;
        this.total = response.total;
      
        this.loading = false;
      });
    },
     //是否自动申报
    AutomaticDeclaration(row) {
      console.log("你好我是自动申报");
      let text = row.isDeclare === "0" ? "停用" : "启用";
      console.log(row.isDeclare);
      this.$confirm('确认要"' + text + '""' + row.atationinfo.stationName + '"的自动申报吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateConfigDeclare(row.id, row.isDeclare);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.isDeclare = row.isDeclare === "0" ? "1" : "0";
        });
    },

    //是否自动录入
    InputClick(row) {
      console.log("你好我是自动录入");
      let text = row.isEntry === "0" ? "停用" : "启用";
      console.log(row.isEntry);
      this.$confirm('确认要"' + text + '""' + row.atationinfo.stationName + '"的自动录入吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateConfigEntry(row.id, row.isEntry);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.isEntry = row.isEntry === "0" ? "1" : "0";
        });
    },

    //散杂货是否自动申报
    BulkCargoDeclaration(row) {
      console.log("你好我是散杂货");
      let text = row.isDeclareGoods === "0" ? "停用" : "启用";
      console.log(row.isDeclareGoods);
      this.$confirm('确认要"' + text + '""' +row.atationinfo.stationName + '"的散杂货自动申报吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateConfigDeclareGoods(row.id, row.isDeclareGoods);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.isDeclareGoods = row.isDeclareGoods === "0" ? "1" : "0";
        });
    },
  }
};
</script>