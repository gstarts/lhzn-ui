<template class="max">
  <div class="all">
    <!-- 第一排 -->
    <el-row :gutter="10">
      <el-col :span="5">
        <div class="L1-1">
           <ve-ring :data="demo03"  :settings="demo003"></ve-ring>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="L1-2">
        <span>我是首页标签!!!!!!</span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="L1-3">
         <ve-pie :data="demo08" :settings="demo008"></ve-pie>
        </div>
      </el-col>
    </el-row>
      <!-- 第二排 -->
    <el-row :gutter="10">
      <el-col :span="5">
        <div class="L2-1">
                 <ve-bar :data="demo02"  width="100%" height="300px" ref="tubiaoTest" ></ve-bar>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="L2-2">
            <ve-line :data="demo02"  width="100%" height="300px" ref="tubiaoTest" :toolbox="toolbox">
</ve-line>
            </div>
      </el-col>
      <el-col :span="5">
          <div class="L1-3">
             <ve-bar :data="demo07" :settings="demo007" height="270px"></ve-bar>
          </div>
      </el-col>
    </el-row>
    <!-- 第三排 -->
    <el-row :gutter="10">
         <el-col :span="5">
            <div class="L3-1">
                <ve-waterfall :data="demo05" :settings="demo005" height="280px"></ve-waterfall>
            </div>
         </el-col>
         <el-col :span="14">
             <div class="L3-2">
             <ve-histogram :data="demo01" :settings="demo001"></ve-histogram>
             </div>
         </el-col>
         <el-col :span="5">
             <div class="L3-3">
                 <ve-heatmap :data="demo06" height="250px"></ve-heatmap>
             </div>
         </el-col>
    </el-row>
    <!-- 第四排 -->
    <el-row :gutter="10">
        <el-col :span="5">
            <div class="L4-1">
              <ve-bar :data="demo04" :settings="demo004" height="180px"></ve-bar>
            </div>
        </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
   data () {
     this.demo001 = {
        axisSite: { right: ['下单率'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['数值', '比率']
      }
      this.demo002 = {
        xAxisType: 'value'
      }
      this.demo003 =  {
        radius: [60, 40],
        offsetY: 85
      }
      this.demo004 =  {
        stack: {
          'aaa': ['访问用户', '下单用户','下单率']
        }
      }
       this.demo005 = {
        totalNum: 24,
        totalName: '总时间',
        remainName: '剩余时间'
      }
     
      this.demo007 = {
        dimension: ['日期'],
        metrics: ['访问用户']
      }
       this.demo008 = {
        roseType: 'radius',
        radius: 90,
        offsetY: 130
      }
      return {
        demo02: {
  columns: ['日期', '访问用户', '下单用户', '下单率'],
  rows: [
    { '日期': '周一', '访问用户': 1393, '下单用户': 1093, '下单率': 2019.32 },
    { '日期': '周二', '访问用户': 3530, '下单用户': 3230, '下单率': 5201.26 },
    { '日期': '周三', '访问用户': 2923, '下单用户': 2623, '下单率': 1019.76 },
    { '日期': '周四', '访问用户': 1723, '下单用户': 1423, '下单率': 9019.49 },
    { '日期': '周五', '访问用户': 3792, '下单用户': 3492, '下单率': 6019.323 },
    { '日期': '周六', '访问用户': 4593, '下单用户': 4293, '下单率': 4019.78 },
    { '日期': '周日', '访问用户': 5000, '下单用户': 4000, '下单率': 8019.78 }
  ]
},
demo01: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
          ]
        },
demo03: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        },
        demo04: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 500 },
          ]
        },
         demo05: {
          columns: ['活动', '时间'],
          rows: [
            { '活动': '吃饭', '时间': 4 },
            { '活动': '睡觉', '时间': 10 },
            { '活动': '打豆豆', '时间': 5 }
          ]
        },
        demo06: {
          columns: ['时间', '地点', '人数'],
          rows: [
            { '时间': '星期一', '地点': '北京', '人数': 1000 },
            { '时间': '星期二', '地点': '上海', '人数': 400 },
            { '时间': '星期三', '地点': '杭州', '人数': 800 },
            { '时间': '星期二', '地点': '深圳', '人数': 200 },
            { '时间': '星期三', '地点': '长春', '人数': 100 },
            { '时间': '星期五', '地点': '南京', '人数': 300 },
            { '时间': '星期四', '地点': '江苏', '人数': 800 },
            { '时间': '星期一', '地点': '北京', '人数': 700 },
            { '时间': '星期三', '地点': '上海', '人数': 300 },
            { '时间': '星期二', '地点': '杭州', '人数': 500 }
          ]
        },
         demo07: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
          ]
        },
        demo08: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        },
//配置显示折线图/柱状图切换按钮以及另存为图片按钮。
toolbox: {
  feature: {
    magicType: {type: ['line', 'bar','radar']},
    saveAsImage: {}
  }
},
      }
    }
  }
</script>

<style lang="scss" scoped>
.max{

  background: rgb(192, 192, 192);
}
.all {
  
  margin: 10px;
}
.L1-1 {
    background: rgb(247, 247, 247);
  width: 100%;
  height: 150px;
  color: blanchedalmond;
}
.L1-2 {
  font-size: 35px;
  background: rgb(247, 247, 247);
  text-align:center;
  width: 100%;
  height: 100px;
}
.L1-3 {
  background: rgb(247, 247, 247);
  width: 100%;
  height: 260px;
  margin-bottom:10px;
  padding-top: 20px;
  
}
.L2-1 {
  background: rgb(247, 247, 247);
  width: 100%;
  height: 250px;
  margin-top: -110px;
}
.L2-2 {
  background: rgb(247, 247, 247);
  padding: 60px;
  width: 100%;
  height: 300px;
  margin-top:-160px;
}
.L3-1{
  background: rgb(247, 247, 247);
    width: 100%;
  height: 250px;
  margin-top:-120px;
}
.L3-2{
  background: rgb(247, 247, 247);
    width: 100%;
    height: 380px;
    margin-top: -120px;
}
.L3-3{
  background: rgb(247, 247, 247);
  width: 100%;
  height: 260px;
  margin-bottom:10px;
}
.L4-1{
  background: rgb(247, 247, 247);
    width: 100%;
    height: 120px;
    margin-top:-130px;
}
</style>