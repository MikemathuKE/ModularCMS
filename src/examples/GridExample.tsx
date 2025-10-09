import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/LayoutComponents";
import { Heading3, Paragraph, Button } from "@/components/GeneralComponents";
import { ImageMedia } from "@/components/MediaComponents";

export default function ExampleGrid() {
  return (
    <Grid>
      <Card>
        <ImageMedia
          src="/images/underwater.jpg"
          alt="Card Image 1"
          width={800}
          height={200}
        />

        <CardContent>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at
            sapien eu lorem bibendum congue.
          </Paragraph>
        </CardContent>

        <CardFooter>
          <Button>Learn More</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading3>Card Title 2</Heading3>
        </CardHeader>

        <CardContent>
          <ImageMedia
            src="/images/MyLogo.png"
            alt="Card Image 2"
            width={200}
            height={200}
          />

          <Paragraph>
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas.
          </Paragraph>
        </CardContent>

        <CardFooter>
          <Button>Explore</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading3>Card Title 3</Heading3>
        </CardHeader>

        <CardContent>
          <ImageMedia
            src="/images/MyLogo.png"
            alt="Card Image 3"
            width={200}
            height={200}
          />

          <Paragraph>
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae.
          </Paragraph>
        </CardContent>

        <CardFooter>
          <Button>Read More</Button>
        </CardFooter>
      </Card>
    </Grid>
  );
}
