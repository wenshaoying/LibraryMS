<style scoped>
    .new_list{
      width : 100%;
      height: 100%;
      /* overflow: hidden; */
      
      margin-right: 5px;
    }
    li{
      list-style : none;
      font-size  : 14px;
      height     : 20px;
      line-height: 20px;
      width      : 200px;
      cursor     : pointer;
    }
    .active{
      background: rgb(78, 73, 73);
    }

</style>

<template>
    <div>
        <h1>新闻标题: {{newtitle}}</h1>
        <h2>新闻内容:{{newscontent}}</h2>
        <span>发布时间:{{time}}  发布人员:{{newsauthor}}  类别:{{cate}}</span>
        <br>
        
        
    
        <Button type="primary" @click="addData">添加评论</Button>
        <Button type="primary" @click="removes">删除多个</Button>
        <Button type="info" @click="func">新闻</Button>
        

        <Table border :columns="columns" :data="data" @on-selection-change="onSelect" style="margin-top:18px"></Table>
        <Page :total="total" :page-size="rows" @on-change="onChangePage" :page-size-opts=[5,10,15,20] @on-page-size-change="onPageSizeChange" show-sizer />

 
        
        
        <Modal v-model="modalForm" title="数据操作">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem label="内容" prop="content">
                    <quill-editor v-model="formValidate.content"></quill-editor>
                </FormItem>
                <FormItem label="作者" prop="author">
                    <Input v-model="formValidate.author" placeholder="请输入作者"></Input>
                </FormItem>
                    <input type="hidden" name="date">
                    <input type="hidden" name="isTop">
                    
                    
                    

                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
            <div slot="footer">
                
            </div>
        </Modal>
    </div>

</template>
<script>
import Base from '../../base/Base';
import moment from "moment";
export default {
  mixins: [Base],
  data() {
    return {
      nid:'',
      newtitle:'',
      time:'',
      newsauthor:'',
      newscontent:'',
      cate:'',
      node        : '',
      newstitle   : '',
      newdata     : [],
      module      : 'comments',
      formValidate: {
        newsId : '',
        title  : '',
        content: '',
        author : '',
      },
      ruleValidate: {
        newsId: [
          {
            required: true,
            // message : '必须输入标题',
            trigger: 'blur'
          }
        ],
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
        author: [
          {
            required: true,
            message : '必须输入作者',
            trigger : 'blur'
          }
        ]

      },
      columns: [
        {
          type : 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '标题',
          key  : 'title'
        },
        {
          title: '内容',
          key  : 'content',
          render: function(h,params){
        return h('div',{
        domProps:{
        innerHTML: params.row.content
        },
        });
        }
        },
        {
          title: '作者',
          key  : 'author'
        },
        {
          title: '日期',
          key  : 'date'
        },

        {
          title : '操作',
          key   : 'action',
          width : 150,
          align : 'center',
          render: (h, params) => {
            return h('div', [
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
              )
            ]);
          }
        }
      ]
    };
  },
  methods:{
    func (){
                this.$router.push({ path: '/info'});
            },
    handleReachBottom () {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const last = this. newdata[this. newdata.length - 1];
                        for (let i = 1; i < 11; i++) {
                            this. newdata.push(last + i);
                        }
                        resolve();
                    }, 2000);
                });
            },
    getData() {
      
        this.axios({
          url   : `http://localhost:3000/${this.module}/list`,
          method: 'post',
          data  : {
            page: this.page,
            rows: this.rows,
            newsId: this.nid._id,
          }
        }).then(res => {
          this.total = res.data.total;
          this.data  = res.data.rows;
        });
      
    },
    addData(){
        this.handleReset("formValidate");
        delete this.formValidate._id;
        this.modalForm = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formValidate._id) {
            this.formValidate.newsId=this.nid._id;
           this.formValidate.date  = moment().format('YYYY-MM-DD HH:mm:ss');
           this.formValidate.isTop = 0;
            this.axios({
              url: `http://localhost:3000/${this.module}/data/${
                this.formValidate._id
              }`,
              method: 'put',
              data  : this.formValidate
            }).then(res => {
              this.modalForm = false;
              this.getData();
              
              
            });
          } else {
            this.formValidate.isTop = 0;
            this.formValidate.newsId=this.nid._id
            this.axios({
              url   : `http://localhost:3000/${this.module}/data`,
              method: 'post',
              data  : this.formValidate
            }).then(res => {
              this.modalForm = false;
              this.getData();
              
            });
          }
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    onSelectChange(node){
      this.node      = node;
      this.newstitle = node[0].title;
      this.getData();
      this.formValidate.newsId = node[0]._id;
      this.handleSubmit();
    },
    onChangePage(page) {
      this.page = page;
      this.getData();
    },
    onPageSizeChange(rows) {
      this.rows = rows;
      this.getData();
    }
    
  },
  mounted() {
    this.nid=this.$route.query.newid;
    this.newtitle=this.nid.title;
    this.time=this.nid.date;
    this.newscontent=this.nid.content;
    this.newsauthor=this.nid.author;
    this.cate=this.nid.cate;
    this.getData();
  },
};
</script>
