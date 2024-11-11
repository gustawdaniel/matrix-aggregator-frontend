<script setup lang="ts">
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import {useTagStore} from "~/stores/tagStore";
import type {Tag, TagAssignment} from "~/types/Tag";

const props = defineProps<{
  articleId: string;
}>();

const tags = defineModel<TagAssignment[]>({ default: () => []})
const tagStore = useTagStore();
const options = ref<Tag[]>(tagStore.tags)

function tagToAssignment(tag: Tag): TagAssignment {
  return {
    tag_id: tag._id,
    significance: 1,
  }
}

function assignmentToTag(assignment: TagAssignment): Tag {
  return tagStore.tags.find(tag => tag._id === assignment.tag_id)!
}

const selectedTags = computed<Tag[]>({
  get: () => tags.value.map(assignmentToTag),
  set: (newTags) => {
    tags.value = newTags.map(tagToAssignment)
  }
})

// Method to add a new tag
const addTag = async (newTag: string) => {
  console.log('new', newTag);

  const tag = await tagStore.addTag(newTag, '#dbdbdb')

  console.log('tag', tag);

  if(!tag) {
    return alert('Failed to add tag')
  }

  options.value.push(tag)
  tags.value.push(tagToAssignment(tag))
}

watch(tags, async (newTags, oldValue) => {
  console.log('newTags, oldValue', newTags, oldValue)

  try {
    const res = await fetch(`/api/article/${props.articleId}/tags`, {
      method: 'PUT',
      body: JSON.stringify(newTags),
    });

    console.log(res);

    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
})
</script>

<template>
  <div><label class="typo__label">Tagging</label>
    <multiselect v-model="selectedTags" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="name"
                 track-by="_id" :options="options" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
  </div>
</template>

<style scoped></style>
