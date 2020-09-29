<template>
  <!-- 表头信息 -->
  <el-dialog :title="title" :visible.sync="visible" @close="clearHeadId" width="1500px">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="flag"
          @click="clearall"
          v-hasPermi="['animals:head:clear']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="flag"
          @click="submitAnimalHead"
          v-hasPermi="['animals:head:add']"
        >暂存</el-button>
      </el-col>
    </el-row>
    <!-- 提运单表头 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
      <el-row>
        <!-- <el-col :span="6">
          <el-form-item label="数据中心同一编号">
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车次确认编号" prop="tripsNumber">
            <el-input v-model="form.tripsNumber" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>-->
        <el-col :span="6">
          <el-form-item label="关卡代码" prop="customscode">
            <el-input v-model="form.customscode" placeholder="请输入关区代码" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单证状态" prop="documentStatus">
            <el-input v-model="form.documentStatus" placeholder="未暂存" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录入人" prop="cruser">
            <el-input v-model="form.cruser" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报文发送时间" >
          <el-date-picker v-model="form.crtime" type="datetime" placeholder="系统反填" disabled  size="mini"/> </el-form-item>
        </el-col>
      </el-row>
      <!--  <el-row>
        <el-col :span="6">
          <el-form-item label="录入时间" prop="crtime">
            <el-input v-model="form.crtime" placeholder="系统反填" disabled />
          </el-form-item>
      </el-col>-->
      <!-- <el-col :span="6">
          <el-form-item label="统一社会引用代码">
            <el-input v-model="form.contractorcodescc" placeholder="系统反填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组织机构代码" prop="contractorcode">
            <el-input v-model="form.contractorcode" placeholder="系统反填" disabled />
          </el-form-item>
      </el-col>-->
      <!-- <el-col :span="6">
          <el-form-item label="操作人员" prop="operator">
            <el-input v-model="form.operator" placeholder="系统反填" disabled />
          </el-form-item>
      </el-col>-->
      <!-- </el-row> -->

      <el-row>
        <el-col :span="6">
          <el-form-item label="申报数据类型">
            <el-select
              v-model="form.declaredatatype"
              placeholder="请选择申报数据类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in declaredatatypeOptions"
                :key="dict.dictLabel"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作业场所编号" prop="supvloctcode">
            <el-input v-model="form.supvloctcode" placeholder="请输入作业场所编号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类型">
            <el-select v-model="form.businessType" placeholder="请选择业务类型">
              <el-option
                v-for="dict in businessTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 提运单body列表 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="clearBody"
          v-hasPermi="['animals:body:clear']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="submitAnimalBody"
          :disabled="flag"
          v-hasPermi="['animals:body:add']"
        >暂存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="flag ||multiple"
          @click="handleDelete"
          v-hasPermi="['animals:body:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload"
          size="mini"
          :disabled="flag"
          @click="handleImport"
          v-hasPermi="['animals:body:import']"
        >导入</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="bodyList"
        @selection-change="handleSelectionChange"
        @cell-dblclick="doubleClick"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="商品子类" align="center" prop="goodssubclass" />
        <el-table-column label="集装箱号" align="center" prop="contaid" />
        <el-table-column label="商品编号" align="center" prop="goodscode" />
        <el-table-column
          label="数据处理标识"
          align="center"
          prop="datadealflag"
          :formatter="datadealFormat"
        />
        <el-table-column label="提单号" align="center" prop="billno" />
        <el-table-column label="报单号" align="center" prop="entryid" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
    </el-row>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 提运单表体 -->
    <div style="margin:25px">
      <el-form ref="bodyForm" :model="bodyform" :rules="bodyRules" label-width="100px" size="mini">
        <el-row>
          <el-col :span="6">
            <el-form-item label="商品类别" prop="goodsclassify">
              <!-- <el-select v-model="bodyform.goodsclassify" placeholder="请选择商品类别" style="width:250px">
                <el-option
                  v-for="dict in goodsTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>-->
              <el-input v-model="bodyform.goodsclassify" placeholder="请输入商品类别" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品子类" prop="goodssubclass">
              <!-- <el-select v-model="bodyform.goodssubclass" placeholder="请选择商品子类" style="width:250px">
                <el-option
                  v-for="dict in inOutOptions"
                  :key="dict.dictValue+'in'"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>-->
              <el-input v-model="bodyform.goodssubclass" placeholder="请输入商品子类" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编号" prop="goodscode">
              <el-input v-model="bodyform.goodscode" placeholder="请输入商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称" prop="goodsname">
              <el-input v-model="bodyform.goodsname" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="规格型号" prop="goodsmodel">
              <el-input v-model="bodyform.goodsmodel" placeholder="请规格型号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="quantity">
              <el-input v-model="bodyform.quantity" placeholder="请输入数量" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位kg" prop="unit">
              <el-input v-model="bodyform.unit" placeholder="请输入单位kg" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="集装箱号" prop="contaid">
              <el-input v-model="bodyform.contaid" placeholder="请输入集装箱号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="进场时间" prop="entrancedate">
              <el-date-picker
                clearable
                size="mini"
                style="width: 250px"
                v-model="bodyform.entrancedate"
                type="datetime"
                value-format="yyyy-mm-dd HH:mm:ss"
                placeholder="选择时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数据处理标识">
              <el-select
                v-model="bodyform.datadealflag"
                placeholder="请选择数据处理标识"
                style="width:250px"
              >
                <el-option
                  v-for="dict in dataFlagOptions"
                  :key="dict.dictValue+'da'"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提单号" prop="billno">
              <el-input v-model="bodyform.billno" placeholder="请输入提单号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报关单号" prop="entryid">
              <el-input v-model="bodyform.entryid" placeholder="请输入报关单号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="转关单号" prop="preno">
              <el-input v-model="bodyform.preno" placeholder="请输入转关单号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="多式联运单号" prop="mtapplyblno">
              <el-input v-model="bodyform.mtapplyblno" placeholder="请输入多式联运单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="bodyform.remark" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
    </div>
    <!-- 上传按钮对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?headId=' + this.headId"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  addAnimals,
  updateAnimals,
  delAnimals,
  init,
  getAnimals
} from "@/api/animal/animals";
import {
  listBody,
  getBody,
  addBody,
  updateBody,
  delBody,
  importTemplate
} from "@/api/animal/body";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      tables: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 标题
      title: "",
      // 中间变量
      headId: "",
      // 按钮是否禁用
      flag: false,
      // 表数据
      bodyList: [],
      // 选中数组
      ids: [],
      //申报数据类型
      declaredatatypeOptions: [],
      //商品类别
      goodsTypeOptions: [],
      // 业务类型
      businessTypeOptions: [],
      // 进出标志
      inOutOptions: [],
      // 提单类型
      waybillTypeOptions: [],
      //数据处理
      dataFlagOptions: [],
      // 表单参数
      form: {
        declaredatatype: "0"
      },
      bodyform: {},
      // 表头表单校验
      rules: {},
      // 表体表单校验
      bodyRules: {
        entrancedate: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ]
      },
      //
      submitwaybllForm: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        headId: undefined,
        tableName: undefined,
        tableComment: undefined
      },
      // 上传文件
      upload: {
        // 是否显示弹出层（）
        open: false,
        // 弹出层标题（）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 上传参数
        headId: undefined,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/animal/importData"
      }
    };
  },
  created() {
    // 业务申报类型
    this.getDicts("station_declare_type").then(response => {
      this.declaredatatypeOptions = response.data;
    });
    // 商品类别
    this.getDicts("station_goods_type").then(response => {
      this.goodsTypeOptions = response.data;
    });
    // 数据处理
    this.getDicts("station_data_flag").then(response => {
      this.dataFlagOptions = response.data;
    });

    this.getDicts("station_business_type").then(response => {
      this.businessTypeOptions = response.data;
    });
    this.getDicts("station_IO_flag").then(response => {
      this.inOutOptions = response.data;
    });
    this.getDicts("station_waybill_type").then(response => {
      this.waybillTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询提运单表体列表 */
    getList() {
      this.queryParams.headId = this.headId;
      listBody(this.queryParams).then(res => {
        if (res.code === 200) {
          this.bodyList = res.rows;
          this.total = res.total;
        }
      });
    },
    /** 页面数据初始化 */
    initialization() {
      init().then(res => {
        this.form = res.data;
        this.headId = this.form.id;
      });
    },
    // 显示弹框
    show() {
      console.log("aaaaaaaaa");
      this.visible = true;
      if (this.headId) {
        getAnimals(this.headId).then(response => {
          this.form = response.data;
          var date = new Date(this.crtime);
          this.form.crtime = formatDate(date);
        });
        this.getList();
      } else {
        this.initialization();
      }
    },
    initSelect() {},
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 绑定介质类型翻译
    mediumTypeFormat(row, column) {
      return this.selectDictLabel(this.mediumTypeOptions, row.businessType);
    },
    //数据处理识别翻译
    datadealFormat(row, column) {
      return this.selectDictLabel(this.dataFlagOptions, row.datadealflag);
    },
    // 提单类型翻译
    waybillTypeFormat(row, column) {
      return this.selectDictLabel(this.waybillTypeOptions, row.businessType);
    },

    /** 表头新增(清空页面)按钮 */
    clearall: function() {
      this.clearHead();
      this.clearBody();
      this.initialization();
    },

    /** 表体暂存按钮 */
    submitAnimalBody: function() {
      this.$refs["bodyForm"].validate(valid => {
        if (valid) {
          if (this.bodyform.id != undefined) {
            updateBody(this.bodyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else if (this.headId != undefined) {
            this.bodyform.headId = this.headId;
            addBody(this.bodyform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.clearBody();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.msgError("请先填写表头信息");
          }
        }
      });
    },
    //弹框关闭
    clearHeadId() {
      this.headId = undefined;
    },
    /** 表表头暂存按钮 */

    submitAnimalHead: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.documentStatus = "0";
          addAnimals(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },

    /* submitAnimalHead: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAnimals(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.clearHead();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.genID();
            addAnimals(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.$emit("ok");
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    }, */
    // 重置表体信息
    clearBody() {
      this.bodyform = {
        id: undefined,
        goodsclassify: undefined,
        goodssubclass: undefined,
        goodscode: undefined,
        goodsname: undefined,
        goodsmodel: undefined,
        quantity: undefined,
        unit: undefined,
        contaid: undefined,
        entrancedate: undefined,
        datadealflag: undefined,
        billno: undefined,
        entryid: undefined,
        preno: undefined,
        mtapplyblno: undefined,
        remark: undefined
      };
    },
    clearheadId() {
      this.form = {
        id: undefined,
        headId: undefined
      };
    },
    clearHead() {
      this.form = {
        id: undefined,
        customscode: undefined,
        supvloctcode: undefined,
        decldate: undefined,
        declaredatatype: "0",
        totalmsgno: undefined,
        curmsgno: undefined,
        recvdecldata: undefined
      };
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delBody(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /**生成headID */
    genID() {
      this.headId = new Date().getTime();
      this.form.id = this.headId;
    },
    /** 行点击按钮 */
    doubleClick(row, column, cell, event) {
      if (row.id != undefined) {
        getBody(row.id).then(res => {
          if (res.code === 200) {
            this.bodyform = res.data;
          }
        });
      }
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", {
        dangerouslyUseHTMLString: true
      });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      if (this.headId) {
        this.upload.headId = this.headId;
        this.$refs.upload.submit();
      } else {
        this.msgError("请先保存申报基础信息");
        this.upload.open = false;
      }
    },
    /** 导入按钮 */
    handleImport() {
      this.upload.title = "动植物信息导入";
      this.upload.open = true;
    }
  }
};
</script>
<style lang="css" scoped>
.el-select {
  width: 100%;
}
</style>