<template>
   <div>
     <Row> 
      <Col span="3">  
       <h3 class="newstitle" v-model="newstitle">新闻分类</h3>     
        <Tree :data="treedata" @on-select-change="onSelectChange"></Tree>
        <!-- 树 -->
      </Col>
      <Col span="21">
        <Button type="primary" @click='cateshow'>添加数据</Button>
          <Button type="primary" @click="removes">删除多个</Button>
          <!-- 添加数据，删除数据 -->
        <Input v-model="searchBox" placeholder="Enter something..." style="width: 200px"/>
          <Button type="primary" @click="onSearch">search</Button>
          <!-- 搜索框 -->

          <Table border :columns="columns" :data="data" @on-selection-change="onSelect"></Table>
          <Page :total="total" :page-size="rows" @on-change="onChangePage" :page-size-opts=[5,10,15,20] @on-page-size-change="onPageSizeChange" show-sizer />
      </Col>
        <Modal v-model="modalForm" title="数据操作" >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
                </FormItem>              
                <FormItem label="来源" prop="source">
                    <Input v-model="formValidate.source" placeholder="信息来源"></Input>
                </FormItem>
                <FormItem label="作者" prop="author">
                    <Input v-model="formValidate.author" placeholder="作者"></Input>
                </FormItem>
                <FormItem label="分类" prop="cate">
                   <!-- <Cascader :data="data" :value.sync="value1"></Cascader> -->
                    <Input v-model="formValidate.cate" placeholder="分类"></Input>
                </FormItem>
                <FormItem label="发布时间" prop="date">
                    <Input v-model="formValidate.date" placeholder="发布时间"></Input>
                </FormItem>
                <FormItem label="是否发布" prop="isPublish">
                    <Select v-model="formValidate.isPublish">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>   
                </FormItem>
                <FormItem label="是否置顶" prop="isTop">
                  <Select v-model="formValidate.isTop">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select> 
                </FormItem>
                <FormItem label="是否热搜" prop="isHot">
                    <Select v-model="formValidate.isHot">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select> 
                </FormItem>
                <FormItem label="内容" prop="content">
                   <quill-editor v-model="formValidate.content"></quill-editor>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
            <div slot="footer">
                是否立即发布新闻呢？
            </div>
        </Modal>    
     </Row>
   </div>

</template>
<script>
import Base from '../../base/Base';
export default{
  mixins: [Base],
  data(){
     return {
      searchBox: "",
      treedata : [],
      module   : 'news',
      cateId   : '',
      cityList : [
                    {
                        value: 1,
                        label: '是'
                    },
                    {
                        value: 0,
                        label: '否'
                    },                  
                ],
      formValidate: {
        title : '',
        cateId: '',
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message : '必须输入标题',
            trigger : 'blur'
          }
        ],
        content: [
          {
            required: true,
            message : '必须输入内容',
            trigger : 'blur'
          }
        ],
        source: [
          {
            required: true,
            message : '来源',
            trigger : 'blur'
          }
        ],
        author: [
          {
            required: true,
            message : '作者',
            trigger : 'blur'
          }
        ]
      },
      columns: [
        {
          type : 'selection',
          width: 50,
          align: 'center'
        },
         {
          title: '标题',
          key  : 'title'
        },
      
        {
          title: '来源',
          key  : 'source'
        },
        {
          title: '分类',
          key  : 'cate'
        },
        {
          title: '作者',
          key  : 'author'
        },
        {
          title: '发布时间',
          key  : 'date'
        },
        {
          title: '是否发布',
          key  : 'isPublish'
        },
        {
          title: '是否置顶',
          key  : 'isTop'
        },
        {
          title: '是否热搜',
          key  : 'isHot'
        },
        //  {
        //  title: '内容',
        //   key  : 'content'
        // },
        {
          title : '操作',
          key   : 'action',
          width : 230,
          align : 'center',
          render: (h, params) => {
            return h('div', [
               h(
                 {
                    domProps:{
                      innerHTML: params.row.content
                    },
                 }
               ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row._id);
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row._id);
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.func(params.row);
                    }
                  }
                },
                '评论'
              )
            ]);
          },
        }
      ]
    };
  },
  methods:{
    changnewid(a){
      this.newid = a;
    }
    ,
    func (a){
                this.$router.push({ path: '/comment',query:{newid:a} });
            },
     cateshow(){
        if (this.cateId !='') {
              this.modalForm = true;
            } else {
              this.modalForm = false;
              this.$Message.error('请选择子分支');
        }
     },
     handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formValidate._id) {
            // var eDate                  = moment().format('YYYY-MM-DD HH:mm:ss');
            //     this.formValidate.date = eDate;
            this.axios({
              url: `http://localhost:3000/${this.module}/data/${
                this.formValidate._id
              }`,
              method: 'put',
              data  : this.formValidate
            }).then(res => {
              this.modalForm = false;
              this.getData();
              this.formValidate = {};
            });
          } else {
            this.formValidate.cateId = this.cateId;
            this.axios({
              url   : `http://localhost:3000/${this.module}/data`,
              method: 'post',
              data  : this.formValidate
            }).then(res => {
              this.modalForm = false;
              this.axios({
                url   : `http://localhost:3000/${this.module}/list`,
                method: 'post',
                data  : {
                  cateId: this.cateId,
                  page  : this.page,
                  rows  : this.rows
                }
              }).then(res => {
                this.total = res.data.total;
                this.data  = res.data.rows;
              });
              this.formValidate = {};
            });
          }
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    getData() {
      if (this.cateId) {
        this.axios({
          url   : `http://localhost:3000/${this.module}/list`,
          method: 'post',
          data  : {
            cateId: this.cateId,
            page  : this.page,
            rows  : this.rows
          }
        }).then(res => {
          this.total = res.data.total;
          this.data  = res.data.rows;
        });
      } else {
        this.axios({
          url   : `http://localhost:3000/${this.module}/list`,
          method: 'post',
          data  : {
            page: this.page,
            rows: this.rows
          }
        }).then(res => {
          this.total = res.data.total;
          this.data  = res.data.rows;
        });
      }
    },
     getTree(){
        this.axios({
          url   : 'http://localhost:3000/cate/list/1',
          method: 'post'
            }).then(res=>{
            this.treedata = res.data;
            })
    },
    onChangePage(page) {
      this.page = page;
      if (this.searchBox) {
        this.onSearch();
      } else {
        this.getData();
      }
    },
    onPageSizeChange(rows) {
      this.rows = rows;
      if (this.searchBox) {
        this.onSearch();
      } else {
        this.getData();
      }
    },
    onSearch() {
      this.axios({
        url   : `http://localhost:3000/${this.module}/list`,
        method: 'post',
        data  : {
          name: this.searchBox,
          page: 1,
          rows: this.rows
        }
      }).then(res => {
        this.total = res.data.total;
        this.data  = res.data.rows;
      });
      console.log(1);
    },
     getTree(){
         this.axios({
          url   : 'http://localhost:3000/cate/list/1',
          method: 'post'
           }).then(res=>{
          this.treedata = res.data;
        })
    },
    onSelectChange(node) {
      this.cateId = node[0]._id;
      this.page   = 1;            //选择分支，显示分支内的数据并获取当前分支的ID
      this.axios({
        url   : `http://localhost:3000/${this.module}/list`,
        method: 'post',
        data  : {
          cateId: this.cateId,
          page  : this.page,
          rows  : this.rows
        }
      }).then(res => {
        this.total = res.data.total;
        this.data  = res.data.rows;
      });
    }
  },
  mounted() {
    this.getData();
    this.getTree();
  }
}
</script>

