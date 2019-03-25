

<template>
  <div>
    <Button type="info" @click="modalFrom=true">添加</Button>
    <Button type="success" @click="removes">删除多个</Button>
    <Input search  placeholder="请输入搜索的问题" style="width: auto" v-model="searchBox" @on-search="onserch">
    <Icon type="ios-search" slot="suffix"/>
    </Input>

    <Table border :columns="columns" :data="data" ref="selection"  @on-selection-change="onSelect"></Table>
    <Page :page-size="rows" :total="total" @on-change="onChangepage" :page-size-opts=[5,10,15,20] @on-page-size-change="onpageSizeChange" show-sizer />

    <Modal v-model="modalFrom" title="数据操作">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">

        <FormItem label="问题" prop="question">
          <Input v-model="formValidate.question" placeholder="请写出你的问题"></Input>
        </FormItem>
        <FormItem label="回答内容" prop="answer">
          <Input v-model="formValidate.answer" placeholder="回答内容"></Input>
        </FormItem>

        <FormItem>

          <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>

      </Form>
      <div slot="footer">数据操作</div>
    </Modal>
  </div>
</template>

<script>
//import Base from '../../base/Base';
export default {
  // mixins:[Base],
  data() {
    return {
        searchBox   : '',
        ids         : [],
        formValidate: {

        question: '',
        answer  : '',

        data: '',


      },

       ruleValidate: {

        question: [
          { required: true, message: '请输入你要提出的问题', trigger: 'blur' }
        ],

        answer: [
           { required: true, message: '请输入回答内容', trigger: 'blur' }
         ],


        date: [{ message: '日期', trigger: 'blur' }],
       },
      columns: [
        {
          type : 'selection',
          width: 50,
          align: 'center'
        },

        {
          title: '常见问题',
          key  : 'question',
          width: 280,
        },


        {
          title: '最佳回答',
          key  : 'answer',

        },
        {
          title: '日期',
          key  : 'date',
          width: 150,
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
                     // console.log(params.index);
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
                  on: {
                    click: () => {
                      this.remove(params.row._id);
                      //console.log(params);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }
      ],
      data     : [],
      total    : 0,
      page     : 1,
      rows     : 5,
      modalFrom: false
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
       // console.log(valid,this.$refs[name]);
        //console.log(this.formValidate._id);
        //console.log(this.formValidate);
        if (valid) {
          // console.log(this.formValidate);
          if(this.formValidate._id){
              this.axios({
            url   : `http://localhost:3000/help/data/${this.formValidate._id}`,
            method: 'put',
            data  : this.formValidate
          }).then(res => {
            this.modalFrom = false;
            this.getData();
            this.formValidate = {};
          });

          }else{


          this.axios({
            url   : 'http://localhost:3000/help/data',
            method: 'post',
            data  : this.formValidate
          }).then(res => {
            this.modalFrom = false;
            this.getData();
           this.formValidate = {};

          });

          }
           this.$Message.success('Success!');
        } else {
          this.modalFrom = false;
          this.$Message.error('Fail!');
        }
      });
    },
    handleReset(name) {
      this.modalFrom = false;
      this.$refs[name].resetFields();
    },

    ok() {
      this.$Message.info('Clicked OK');
    },
    cancel() {
      this.$Message.info('Clicked cancel');
    },
    edit(id) {
     // console.log(id);
     this.axios({
       url   : `http://localhost:3000/help/data/${id}`,
       method: 'get'
     }).then(res=>{
       //console.log(res.data);
       this.formValidate = res.data;
       this.modalFrom    = true;
     })

    },
    remove(id) {
      //this.data.splice(index, 1);
      this.$Modal.confirm({
        title  : '确认操作',
        content: '<p>你确认删除该条记录吗？</p>',
        onOk   : () => {
          this.axios({
            url   : `http://localhost:3000/help/data/${id}`,
            method: `delete`,

          }).then(res => {
            this.getData();
             this.$Message.info('删除成功');
          });
        },
        onCancel: () => {
          this.$Message.info('取消成功');
        }
      });
    },
    getData() {
      this.axios({
        url   : 'http://localhost:3000/help/list',
        method: 'post',
        data  : {
          page: this.page,
          rows: this.rows
        }
      }).then(res => {
       // console.log(res);
        this.total = res.data.total;
        this.data  = res.data.rows;
      });
    },
    onChangepage(page) {
     // console.log(page);
      this.page = page;
      this.getData();
    },
    onpageSizeChange(rows) {
    //  console.log(rows);
      this.rows = rows;
      this.getData();
    },
    onSelect(selections){
     // console.log(selection)
     var ids = [];
     for(let i=0;i<selections.length;i++){
       ids.push(selections[i]._id);
       //console.log(ids);
     }
     this.ids = ids.toString();
    },
    removes(){
      this.$Modal.confirm({
        title  : '确认操作',
        content: '<p>你确认删除该记录吗？</p>',
        onOk   : ()=>{
          this.axios({
            url   : 'http://localhost:3000/help/data/removes',
            method: 'post',
            data  : {
              ids: this.ids
            }
          }).then(res=>{
            this.getData();
          })

        }
      })
    },
    onserch(){
      this.axios({
        url   : 'http://localhost:3000/help/list',
        method: 'post',
        data  : {
          question: this.searchBox,

          rows    : this.rows
        }
      }).then(res=>{
        this.total = res.data.total;
        this.data  = res.data.rows;
       // console.log(111);
      })
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
