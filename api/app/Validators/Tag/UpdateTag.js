'use strict';

class UpdateTag {
  get rules() {
    const tagId = this.ctx.params.id;
    return {
      archive_id: `unique:tags,archive_id,id,${tagId}`,
      tag_name: `unique:tags,tag_name,id,${tagId}`
    };
  }

  get messages() {
    return {
      'archive_id.unique': 'El tag con archive_id ya se encuentra registrada.',
      'tag_name.unique': 'El tag con tag_name ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateTag;
