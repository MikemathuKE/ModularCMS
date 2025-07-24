import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/LayoutComponents";
import { Heading3, Paragraph } from "@/components/GeneralComponents";
import {
  ImageMedia,
  VideoMedia,
  AudioMedia,
} from "@/components/MediaComponents";

export default function ExampleMedia() {
  return (
    <Grid>
      <Card>
        <CardHeader>
          <Heading3>Image Card</Heading3>
        </CardHeader>
        <CardContent>
          <ImageMedia
            src="/images/MyLogo.png"
            alt="Beautiful Landscape"
            width={200}
            height={200}
          />
          <Paragraph>
            A stunning view of mountains and rivers. This image captures the
            beauty of nature.
          </Paragraph>
        </CardContent>
        <CardFooter>
          <Paragraph>Uploaded on: July 20, 2025</Paragraph>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading3>Audio Card</Heading3>
        </CardHeader>
        <CardContent>
          <AudioMedia src="/audios/LogoIntro.mp3" controls />
          <Paragraph>
            Listen to this relaxing podcast episode about mindfulness and
            productivity.
          </Paragraph>
        </CardContent>
        <CardFooter>
          <Paragraph>Duration: 18:32</Paragraph>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading3>Video Card</Heading3>
        </CardHeader>
        <CardContent>
          <VideoMedia
            src="/videos/Logo reveal.mp4"
            controls
            width={400}
            height={250}
          />
          <Paragraph>
            A tutorial on how to use the new CMS features. Covers layout editing
            and theming.
          </Paragraph>
        </CardContent>
        <CardFooter>
          <Paragraph>Length: 4m 12s</Paragraph>
        </CardFooter>
      </Card>
    </Grid>
  );
}
