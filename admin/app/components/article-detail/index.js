import React, {Component} from 'react';
import {Form, Input, Button, Select} from 'antd';

import Ueditor from '../ueditor';
import {SERVER_ADDRESS} from '../../config/config';

const FormItem = Form.Item;
const Option = Select.Option;

class ArticleDeatil extends Component {
	constructor(props) {
		super(props);
		this.state = {
			article: {},
			categories: []
		}
	}

	static contextTypes = {
 		router: React.PropTypes.object
	}
	
	componentDidMount() {
		if(this.props.id != null) {
			fetch(`${SERVER_ADDRESS}/get-article-detail/${this.props.id}`).then((response) => {
				
				if(response.status !== 200) {
					throw new Error('Load Failed, Status:' + response.status);
					this.setState({error: "Load Failed"});
				}

				response.json().then((responseJson) => {
					if(responseJson.status == 0) {
						this.setState({error: responseJson.message});
					}
					else {
						this.setState({article: responseJson.info});
					}
				}).catch((error) => {
					this.setState({error: "Load Failed"});
				})
				
			}).catch((error) => {
				this.setState({error: "Load Failed"});
			});
		}

		fetch(`${SERVER_ADDRESS}/get-categories`).then((response) => {
			
			if(response.status !== 200) {
				throw new Error('Load Failed, Status:' + response.status);
				this.setState({error: "Load Failed"});
			}

			response.json().then((responseJson) => {
				if(responseJson.status == 0) {
					this.setState({error: responseJson.message});
				}
				else {
					this.setState({categories: responseJson.info});
				}
			}).catch((error) => {
				this.setState({error: "Load Failed"});
			})
			
		}).catch((error) => {
			this.setState({error: "Load Failed"});
		});
	}
	
	handleChange = (content) => {
		this.state.content = content;
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let content = this.state.content;

				if(content.trim() == '') {
					alert('文章内容为空！');
					return;
				}

				values.id = this.props.id;
				values.content = content;

				fetch(`${SERVER_ADDRESS}/article-submit`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(values)
				}).then((response) => {
					
					if(response.status !== 200) {
						throw new Error('Failed, Status:' + response.status);
						this.setState({error: "Load Failed"});
					}
	
					response.json().then((responseJson) => {
						if(responseJson.status == 0) {
							this.setState({error: responseJson.message});
						}
						else {
							alert("文章提交成功！");
							if(this.props.id == null) {
								this.context.router.push(`/articles`);
							}
						}
					}).catch((error) => {
						this.setState({error: "Load Failed"});
					})
					
				}).catch((error) => {
					this.setState({error: "Load Failed"});
				});
			}
		});
	}

	render() {
		let {title, tag, type, category, body} = this.state.article;
		const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

		const tagError = isFieldTouched('tag') && getFieldError('tag');
		const titleError = isFieldTouched('title') && getFieldError('title');

		const prefixType = getFieldDecorator('type', {
			initialValue: type ? type + '' : '1'
		})(
			<Select>
				<Option value="1">原创</Option>
				<Option value="2">转载</Option>
				<Option value="3">翻译</Option>
			</Select>
		);

		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<FormItem
						validateStatus={titleError ? 'error' : ''}
						help={titleError || ''}
						label="文章标题"
					>
					{
						getFieldDecorator('title', {
							initialValue: title,
							rules: [{required: true, message: 'Please input title!'}]
						})(
							<Input addonBefore={prefixType} placeholder="title" style={{width: 400}}/>
						)
					}
					</FormItem>
					<FormItem
						validateStatus={tagError ? 'error' : ''}
						help={tagError || ''}
						label="文章标签"
					>
					{
						getFieldDecorator('tag', {
							initialValue: tag,
							rules: [{required: true, message: 'Please input tag!'}]
						})(
							<Input placeholder="tag" style={{width: 250}}/>
						)
					}
					</FormItem>
					<FormItem label="文章分类">
					{
						getFieldDecorator('category', {
							initialValue: category ? category + '' : '1'
						})(
							<Select style={{width: 100}}>
								{
									this.state.categories.map((cate) => (
										<Option key={cate.id} value={cate.id + ''}>{cate.theme}</Option>
									))
								}
							</Select>
						)
					}
					</FormItem>
					<Ueditor content={body} handleChange={this.handleChange} />
					<div style={{textAlign: "right"}}>
						<FormItem>
							<Button type="primary" htmlType="submit">
								提交
							</Button>
						</FormItem>
					</div>
				</Form>
			</div>
		)
	}
}

const WrappedArticleDetail = Form.create()(ArticleDeatil);

export default WrappedArticleDetail;