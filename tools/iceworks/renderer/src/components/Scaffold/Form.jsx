import { inject, observer } from 'mobx-react';
import { Input, Progress, Checkbox, Select } from '@icedesign/base';
import { shell } from 'electron';
import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import services from '../../services';

import CustomIcon from '../Icon';

const { Option } = Select;

/**
 * 模板生成表单项目
 */

@inject('scaffold')
@observer
export default class ScaffoldForm extends Component {

  openProjectDirectory = () => {
    if (!this.props.scaffold.isCreating) {
      this.props.scaffold.openDirectory();
    }
  };
  /** 修改项目名称 */
  changeProjectName = (value) => {
    this.props.scaffold.setProjectName(value);
  };

  changeProjectFolderName = (value) => {
    this.props.scaffold.setProjectFolderName(value);
  };
  toggleInstall = () => {
    this.props.scaffold.toggleInstall();
  };

  toggleNodeProject = (checked) => {
    this.props.scaffold.toggleNodeSelect(checked);

    if (!checked) {
      this.props.scaffold.toggleNodeProject('');
    }
  };

  handleNodeFrameSelect = (value) => {
    this.props.scaffold.toggleNodeProject(value);
  };

  handleOpenMidwayDoc = () => {
    shell.openExternal('https://midwayjs.org/midway/guide.html');
  };

  render() {
    const isAlibaba = services.settings.get('isAlibaba');
    const hasIce =
      this.props.scaffold.scaffold.devDependencies
      && this.props.scaffold.scaffold.devDependencies.hasOwnProperty('ice-scripts');

    const showNode = !isAlibaba && hasIce;

    return (
      <div className="project-config-form">
        <div className="project-config-form-item">
          <h3 style={{ margin: 0 }}>
            <span style={{ color: 'red' }}>*</span> 路径：
          </h3>
          <Tooltip
            placement={'bottomRight'}
            overlay={
              <div style={{ maxWidth: 120 }}>
                基础路径，项目目录会创建到该路径下
              </div>
            }
          >
            <div onClick={this.openProjectDirectory}>
              <Input
                style={{ width: '100%' }}
                readOnly={true}
                addonAfter={
                  <div>
                    <CustomIcon type={'folderopen'} />
                  </div>
                }
                value={this.props.scaffold.getProjectPathWithWorkspace()}
              />
            </div>
          </Tooltip>
        </div>
        <div className="project-config-form-item">
          <h3 style={{ margin: 0 }}>
            <span style={{ color: 'red' }}>*</span> 项目目录名：
          </h3>
          <Input
            ref="name"
            placeholder={'首字母开头、字母数字中下划线组合 (必填)'}
            disabled={this.props.scaffold.isCreating}
            value={this.props.scaffold.projectFolderName}
            onChange={this.changeProjectFolderName}
          />
          <div className="project-config-form-item-error-message">
            {this.props.scaffold.projectFolderNameValidation}
          </div>
        </div>
        <div className="project-config-form-item">
          <h3 style={{ margin: 0 }}>项目别名：</h3>
          <Input
            placeholder={'可输入中文 (选填)'}
            disabled={this.props.scaffold.isCreating}
            value={this.props.scaffold.projectName}
            onChange={this.changeProjectName}
          />
        </div>
        { showNode && (
          <div
            className="project-config-form-item"
            style={{ lineHeight: '28px' }}
          >
            <label>
              添加服务端开发框架
              <Checkbox
                disabled={this.props.scaffold.isCreating}
                onChange={this.toggleNodeProject}
                style={{ margin: '0 4px', verticalAlign: 'middle' }}
              />
            </label>
            {
              this.props.scaffold.isNode && (
                <Select
                  placeholder="选择框架"
                  onChange={this.handleNodeFrameSelect}
                  style={{ verticalAlign: 'middle' }}
                >
                  <Option value="midway">Midway</Option>
                  <Option value="koa">Koa</Option>
                </Select>
              )
            }
            {
              this.props.scaffold.nodeFramework === 'midway' && (
                <span
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={this.handleOpenMidwayDoc}
                >
                  <CustomIcon
                    type="help"
                    style={{
                      margin: '0 4px 0 8px',
                      color: '#5797fb'
                    }}
                  />
                  <span style={{ color: '#5797fb' }} >Midway 官方文档</span>
                </span>
              )
            }
          </div>)
        }
        {this.props.scaffold.isCreating && (
          <div className="project-config-form-item">
            <span style={{ fontSize: 12, color: '#999' }}>
              {this.props.scaffold.generatorStatusText}
            </span>
          </div>
        )}
        {this.props.scaffold.isCreating && (
          <div className="project-config-form-item">
            <Progress
              style={{ width: '40%' }}
              showInfo={false}
              percent={this.props.scaffold.progress}
            />
            <span style={{ fontSize: 12, color: '#999', paddingLeft: 10 }}>
              {this.props.scaffold.progress}%
            </span>
            <span style={{ fontSize: 12, color: '#999', paddingLeft: 10 }}>
              {this.props.scaffold.progressSpeed}
              /kbs
            </span>
            <span style={{ fontSize: 12, color: '#999', paddingLeft: 10 }}>
              剩余 {this.props.scaffold.progressRemaining} s
            </span>
          </div>
        )}
      </div>
    );
  }
}
