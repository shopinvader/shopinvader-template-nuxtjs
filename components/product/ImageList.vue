<template>
  <div>
    <div 
      v-if="slider"
      :class="ui.root({ class: 'product-image-list' })"
    >
      <UCarousel
        ref="carousel"
        v-slot="{ item }"
        arrows
        :items="images"
        :prev="{ onClick: onClickPrev }"
        :next="{ onClick: onClickNext }"
        @select="onSelect"
        class="max-w-sm mx-auto"
      >
        <NuxtPicture
          v-if="item.large?.src"
          :src="item.large?.src"
          class="mx-auto max-h-96 min-h-max p-6 object-contain max-sm:w-full lg:max-h-[500px] cursor-zoom-in"
          :alt="item.large?.alt"
          :title="item.large?.alt"
          :img-attrs="{ height: 500 }"
          :placeholder="img(item.large?.src, { h: 500, f: 'webp', q: 10 })"
          format="webp"
          @click="onImageZoom(item)"
        />
      </UCarousel>

      <div class="flex gap-1 justify-center pt-4 mx-auto">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="cursor-pointer rounded bg-gray-100 hover:bg-gray-200 w-16 h-16 overflow-hidden flex items-center justify-center"
          :class="{ 'opacity-100': activeIndex === index }"
          @click="select(index)"
        >
          <nuxt-img
            :src="image.medium?.src"
            class="mx-auto object-fill p-2"
            :alt="image.medium?.alt"
            :title="image.medium?.alt"
            :height="70"
            :width="70"
            :placeholder="img(image.small?.src || '', { h: 70, f: 'webp', blur: 2, q: 10 })"
          />
        </div>
      </div>
    </div>


    <!--
    <template v-if="slider">
      <div class="image-slider" ref="sliderElement">
        <div
          v-for="(image, index) in images"
          :id="'item' + index"
          ref="item"
          class="image-slider__item"
          :key="'img-' + index"
        >
          <NuxtPicture
            v-if="image.large?.src"
            :src="image.large?.src"
            class="item-image"
            :class="zoom ? 'image-zoom' : ''"
            :alt="image.large?.alt"
            :title="image.large?.alt"
            :img-attrs="{ height: 500 }"
            :placeholder="img(image.large?.src, { h: 500, f: 'webp', q: 10 })"
            format="webp"
            @click="onImageZoom(image)"
          />
        </div>
      </div>
      <ul class="slider-indicators">
        <li
          v-for="(image, index) in images"
          :key="'img-indicator' + index"
          class="slider-indicators__items"
          @click="slideCarousel(index + 1)"
        >
          <nuxt-img
            :src="image.medium?.src"
            class="items-image"
            :alt="image.medium?.alt"
            :title="image.medium?.alt"
            :height="70"
            :width="70"
            :placeholder="img(image.small?.src || '', { h: 70, f: 'webp', blur: 2, q: 10 })"
          />
        </li>
      </ul>
      <div class="slider-indicators-mobile">
        <div
          v-for="(image, index) in images"
          :key="'img-indicator' + index"
          @click="slideCarousel(index + 1)"
          ref="indicators"
          class="slider-indicators-mobile__items"
        >
          <icon name="radix-icons:dot-filled" class="items-icons"></icon>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="w-full rounded">
        <div
          v-for="(image, index) in images"
          :id="'item' + index"
          class="w-full bg-gray-100"
          :key="'img-' + index"
        >
          <nuxt-img
            :src="image.large?.src"
            :alt="image.large?.alt"
            :title="image.large?.alt"
            :class="zoom ? 'product-image-zoom' : ''"
            class="mx-auto max-h-full min-h-max w-full p-6"
          />
        </div>
      </div>
    </template>
-->
    <client-only>
      <UDrawer
        v-model:open="selectedImage"
        direction="left"
      >
        <template #content>
          <UCard variant="soft">
            {{  selectedImage?.large?.alt || 'Zoomed Image' }}
            <template #footer>
              
            </template>
          </UCard>
        </template>
      </UDrawer>
      
    </client-only>
  </div>
</template>

<script lang="ts">
import  { type ProductImageSet } from '#models'
import theme from '~/theme/ProductImageList'
export type ProductImageListUi = typeof theme
export interface ProductImageListProps {
  images: ProductImageSet[]
  slider?: boolean
  zoom?: boolean
  ui?: ProductImageListUi
}

</script>
<script lang="ts" setup>
const props = defineProps<ProductImageListProps>()
const carousel = useTemplateRef('carousel')
const ui = componentUI('ProductImageList', theme, props?.ui ||{})({})
console.log('theme', theme, ui)
const activeIndex = ref(0)
const onClickPrev = () => {
  activeIndex.value--
}
const onClickNext = () => {
  activeIndex.value++
}
const onSelect = (index: number) => {
  activeIndex.value = index
}
const select = (index: number) => {
  activeIndex.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}



const img = useImage()
const sliderElement = ref()
const selectedImage = ref<ProductImageSet | null>(null)
const slideCarousel = (goToImageNumber: number) => {
  const carouselContainer: HTMLElement = sliderElement.value as HTMLElement
  const carouselWidth = carouselContainer?.clientWidth
  const targetImage = goToImageNumber - 1
  const targetXPixel = carouselWidth * targetImage + 1
  carouselContainer?.scrollTo(targetXPixel, 0)
}

const onImageZoom = (img:ProductImageSet) => {
  selectedImage.value = img
}

const onImageHover = (e:MouseEvent) => {
  const zoomer = e.currentTarget as HTMLElement;
  if(zoomer) {
    const x = e.offsetX/zoomer.offsetWidth*100
    const y = e.offsetY/zoomer.offsetHeight*100
    zoomer.style.backgroundPosition = x + '% ' + y + '%';
  }

}
</script>
<!-- <style>
@reference "@/assets/css/main.css";

.image-slider {
  @apply carousel w-full items-center rounded max-md:h-full min-h-[500px];
  &__item {
    @apply carousel-item h-full w-full items-center justify-center max-md:max-h-96;
  }
  .item-image {
    img {
      @apply mx-auto max-h-96 min-h-max p-6 object-contain max-sm:w-full lg:max-h-[500px] cursor-zoom-in;
    }
  }
}
.slider-indicators {
  @apply hidden w-full items-center justify-center gap-2 py-2 lg:flex flex-wrap;
  &__items {
    @apply cursor-pointer rounded bg-gray-100 hover:bg-gray-200 w-16 h-16 overflow-hidden flex items-center justify-center;
    .items-image {
      @apply mx-auto object-fill p-2;
    }
  }
}
.slider-indicators-mobile {
  @apply flex flex-wrap w-full justify-center gap-1 py-6 lg:hidden;
  &__items {
    @apply h-full transition  ease-linear;
    .items-icons {
      @apply text-lg;
    }
  }
}
.aside-drawer__side.image-zoom {
  @apply w-screen max-w-full lg:max-w-7xl;
  .image-zoom__zoom {
    @apply flex flex-col lg:flex-row items-start justify-center gap-2 w-full;
    .zoom {
      &__image {
        background-position: 50% 50%;
        background-size: 2000px;
        background-repeat: no-repeat;
        @apply overflow-hidden cursor-zoom-in w-full relative ;
        img {
          @apply cursor-zoom-in hover:opacity-0 block w-full bg-white;
          transition: opacity .5s;
        }
      }
      &__indicators {
        @apply flex flex-row lg:flex-col gap-1 lg:gap-2 items-center;
        .indicators__items {
          @apply card  overflow-hidden cursor-pointer w-20 h-20 flex items-center justify-center;
          &__selected {
            @apply border-primary-500;
          }
        }
      }
    }
  }
}
</style> -->
